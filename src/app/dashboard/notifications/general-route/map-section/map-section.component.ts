import {
    Component,
    effect,
    inject,
    Input,
    input,
    output,
    signal,
    ViewChild
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import {
    MatSnackBar,
    MatSnackBarModule
} from '@angular/material/snack-bar';

import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsService } from '../../../../services/google-maps.service';
import { RouteService } from '../../../../services/route.service';
import { Debtor } from '../../../../models/debtor';
import { Address } from '../../../../models/address';


@Component({
    selector: 'app-map-section',
    imports: [
        MatIconModule,
        MatSnackBarModule,
        GoogleMapsModule
    ],
    templateUrl: './map-section.component.html',
})
export class MapSectionComponent {

    private snackBar = inject(MatSnackBar);
    private googleMapsService = inject(GoogleMapsService);

    routeService = inject(RouteService);

    addresses = input<Address[]>([]);
    debtor = input<Debtor>();

    durationSeconds = signal(0)
    durationMeters = signal(0)
    mapsReady = signal(false);
    orderedAddresses = signal<Address[]>([]);

    encodedPolyline = signal<string | null>(null);

    orderedAddressesChange = output<Address[]>();

    routePath = signal<google.maps.LatLngLiteral[]>([]);

    @ViewChild(GoogleMap) map!: GoogleMap;

    origin = input.required<google.maps.LatLngLiteral>()

    destination = signal<google.maps.LatLngLiteral | undefined>(
        undefined
    );
    intermediates = signal<google.maps.LatLngLiteral[]>([]);
    constructor() {
        effect(() => {

            const addresses = this.addresses();

            const mapsReady = this.mapsReady();

            if (!mapsReady || addresses.length === 0) {
                return;
            }

            this.getRouteData(addresses);
        });

        this.initializeMaps();
    }

    async initializeMaps() {
        try {
            await this.googleMapsService.load();
            this.mapsReady.set(true);
        } catch (error) {
            this.showToast('Erro ao inicializar o Google Maps.')
        }
    }
    fitMapBounds() {

        if (!this.map?.googleMap) {
            return;
        }

        const bounds = new google.maps.LatLngBounds();

        bounds.extend(this.origin());

        const destination = this.destination();

        if (destination) {
            bounds.extend(destination);
        }

        for (const intermediate of this.intermediates()) {
            bounds.extend(intermediate);
        }

        this.map.googleMap.fitBounds(bounds);
    }
    getRouteData(addresses: Address[]) {
        this.destination.set({
            lat: addresses[addresses.length - 1].lat,
            lng: addresses[addresses.length - 1].lng
        })

        this.intermediates.set(addresses.slice(0, -1).map(address => ({
            lat: address.lat,
            lng: address.lng
        })));
        this.fitMapBounds();
        this.routeService.calculateRoute({
            origin: {
                latitude: this.origin().lat,
                longitude: this.origin().lng
            },
            intermediates: addresses.slice(0, -1).map(address => ({
                latitude: address.lat,
                longitude: address.lng
            })),
            destination: {
                latitude: addresses[addresses.length - 1].lat,
                longitude: addresses[addresses.length - 1].lng
            }
        }).then(async response => {
            if (!response.success) {
                this.showToast(response.error);
                return;
            }
            const intermediateAddresses = addresses.slice(0, -1);
            const destination = addresses.at(-1);

            if (!destination) {
                return;
            }

            const optimizedIndexes =
                response.data.optimizedIntermediateWaypointIndex ?? [];

            let optimizedAddresses: Address[];

            if (intermediateAddresses.length <= 1) {
                optimizedAddresses = [
                    ...intermediateAddresses,
                    destination
                ];
            } else {
                optimizedAddresses = [
                    ...optimizedIndexes
                        .filter(index =>
                            index >= 0 &&
                            index < intermediateAddresses.length
                        )
                        .map(index => intermediateAddresses[index]),
                    destination
                ];
            }
            this.orderedAddresses.set(optimizedAddresses);
            this.orderedAddressesChange.emit(optimizedAddresses);
            this.intermediates.set(
                optimizedAddresses.slice(0, -1).map(address => ({
                    lat: address.lat,
                    lng: address.lng
                }))
            );

            this.destination.set({
                lat: destination.lat,
                lng: destination.lng
            });

            this.durationSeconds.set(
                response.data.durationSeconds
            );

            this.durationMeters.set(
                response.data.distanceMeters
            );

            this.encodedPolyline.set(
                response.data.encodedPolyline
            );

            const { encoding } =
                await google.maps.importLibrary(
                    'geometry'
                ) as google.maps.GeometryLibrary;

            const decodedPath =
                encoding.decodePath(
                    response.data.encodedPolyline
                );

            this.routePath.set(
                decodedPath.map(point => ({
                    lat: point.lat(),
                    lng: point.lng()
                }))
            );

            this.fitMapBounds();
        }).catch(error => {
            this.showToast(error)
        });
    }

    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });

    }
}