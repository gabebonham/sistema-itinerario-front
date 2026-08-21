import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-support-observations-section',
    imports: [MatIconModule],
    templateUrl: './support-observations-section.component.html',
})
export class SupportObservationsSectionComponent {
    factsObservations = input<string[]>([]);
    generalObservations = input<string[]>([]);
    propertyObservations = input<string[]>([]);
    plannerObservations = input<string|undefined>();
}
