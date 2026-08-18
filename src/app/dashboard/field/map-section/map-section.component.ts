import { Component, input } from '@angular/core';
import { Address } from '../../../models/address';
import { MatIconModule } from '@angular/material/icon';
import { Debtor } from '../../../models/debtor';

@Component({
    selector: 'app-map-section',
    imports: [MatIconModule],
    templateUrl: './map-section.component.html',
})
export class MapSectionComponent {
    addresses = input<Address[]>([]);
    debtor = input<Debtor>();
}
