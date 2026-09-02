import {
    Component,
    effect,
    inject,
    input,
    signal,
    untracked,
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

    routePath = signal<google.maps.LatLngLiteral[]>([]);

    @ViewChild(GoogleMap) map!: GoogleMap;

    origin: google.maps.LatLngLiteral = {
        lat: -30.0346,
        lng: -51.2177
    };

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

        untracked(() => {
            this.getRouteData(addresses);
        });
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

        bounds.extend(this.origin);

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
        if (addresses.length === 0) {
            return;
        }
        const destination = addresses.at(-1)!;
        const intermediateAddresses = addresses.slice(0, -1);

        this.destination.set({
            lat: destination.lat,
            lng: destination.lng
        });

        this.intermediates.set(
            intermediateAddresses.map(address => ({
                lat: address.lat,
                lng: address.lng
            }))
        );

        this.fitMapBounds();

        this.routeService.calculateRoute({
            origin: {
                latitude: this.origin.lat,
                longitude: this.origin.lng
            },

            intermediates: intermediateAddresses.map(address => ({
                latitude: address.lat,
                longitude: address.lng
            })),

            destination: {
                latitude: destination.lat,
                longitude: destination.lng
            }

        }).then(async response => {

            if (!response.success) {
                this.showToast(response.error);
                return;
            }

            let optimizedAddresses: Address[];

            if (intermediateAddresses.length <= 1) {

                optimizedAddresses = [
                    ...intermediateAddresses,
                    destination
                ];

            } else {

                const optimizedIndexes =
                    response.data.optimizedIntermediateWaypointIndex ?? [];

                optimizedAddresses = [
                    ...optimizedIndexes
                        .filter(index =>
                            index >= 0 &&
                            index < intermediateAddresses.length
                        )
                        .map(index => intermediateAddresses[index])
                        .filter(
                            (address): address is Address =>
                                address !== undefined
                        ),

                    destination
                ];
            }

            this.orderedAddresses.set(optimizedAddresses);

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
            this.showToast(error);
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