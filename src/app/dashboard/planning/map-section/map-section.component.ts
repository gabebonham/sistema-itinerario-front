import {
    Component,
    effect,
    inject,
    input,
    signal
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import {
    MatSnackBar,
    MatSnackBarModule
} from '@angular/material/snack-bar';
import { GoogleMapsModule } from '@angular/google-maps';

import { Debtor } from '../../../models/debtor';
import { CreateAddressDTO } from '../../../DTOS/create-address.dto';
import { GoogleMapsService } from '../../../services/google-maps.service';

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

    address = input<CreateAddressDTO | undefined>(undefined);
    debtor = input<Debtor>();

    mapsReady = signal(false);

    origin: google.maps.LatLngLiteral = {
        lat: -30.0346,
        lng: -51.2177
    };

    destination = signal<google.maps.LatLngLiteral | undefined>(
        undefined
    );

    constructor() {
        effect(() => {
            const address = this.address();
            const mapsReady = this.mapsReady();

            if (!mapsReady || !address) {
                return;
            }

            this.destination.set({
                lat: address.lat,
                lng: address.lng
            });
        });

        this.initializeMaps();
    }

    async initializeMaps() {
        try {
            await this.googleMapsService.load();
            this.mapsReady.set(true);
        } catch (error) {
            this.showToast('Erro ao inicializar o Google Maps.');
        }
    }

    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}