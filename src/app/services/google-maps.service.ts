import { Injectable } from '@angular/core';
import { environment } from '../../environtments/environment.dev';
@Injectable({
    providedIn: 'root'
})
export class GoogleMapsService {

    private loaded = false;

    async load(): Promise<void> {
        if (this.loaded) {
            return;
        }

        if (typeof google !== 'undefined' && google.maps) {
            await google.maps.importLibrary('maps');
            await google.maps.importLibrary('geometry');

            this.loaded = true;
            return;
        }

        await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector(
                'script[data-google-maps]'
            );

            if (existingScript) {
                existingScript.addEventListener('load', () => resolve());
                existingScript.addEventListener('error', () => reject());
                return;
            }

            const script = document.createElement('script');

            script.src =
                `https://maps.googleapis.com/maps/api/js` +
                `?key=${environment.googleMapsApiKey}` +
                `&loading=async`;

            script.async = true;
            script.defer = true;
            script.dataset['googleMaps'] = 'true';
            script.onload = () => resolve();

            script.onerror = () => {
                reject(
                    new Error('Não foi possível carregar o Google Maps.')
                );
            };

            document.head.appendChild(script);
        });

        await google.maps.importLibrary('maps');
        await google.maps.importLibrary('geometry');

        this.loaded = true;
    }
}