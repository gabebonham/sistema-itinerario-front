import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Address } from '../../../../models/address';
import { Debtor } from '../../../../models/debtor';

@Component({
    selector: 'app-map-section',
    imports: [MatIconModule],
    templateUrl: './map-section.component.html',
})
export class MapSectionComponent {
    address = input.required<Address|undefined>();
    debtor = input<Debtor>();
}
