import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddressesEntryComponent } from './address-entry/addresses-entry.component';
import { Address } from '../../../models/address';
@Component({
    selector: 'app-addresses-section',
    imports: [MatSidenavModule, AddressesEntryComponent],
    templateUrl: './addresses-section.component.html',
})
export class AddressesSectionComponent implements OnChanges{
    @Input() addresses: Address[] = [];
    ngOnChanges(changes: SimpleChanges): void {
        console.log('AddressesSection recebeu:', changes['addresses']?.currentValue);
    }
}
