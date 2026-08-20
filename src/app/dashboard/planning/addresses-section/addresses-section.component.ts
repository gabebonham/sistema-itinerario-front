import { Component, computed, EventEmitter, input, Output, signal, effect } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddressesEntryComponent } from './address-entry/addresses-entry.component';
import { Address, AddressEntry } from '../../../models/address';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewAddressModal } from './new-address-modal/new-address-modal.component';


@Component({
    selector: 'app-addresses-section',
    imports: [MatSidenavModule, AddressesEntryComponent, DragDropModule],
    templateUrl: './addresses-section.component.html',
})
export class AddressesSectionComponent {
    addresses = input<Address[]>([]);
    isLoading = input.required<boolean>();
    newAddressCreated = signal(false);
    @Output() orderChanged = new EventEmitter<Address[]>();

    localAddresses = signal<AddressEntry[]>([]);

    constructor(private dialog: MatDialog) {
        effect(() => {
            this.localAddresses.set(this.addresses().map(address => ({
                name:address.name,
                new: false,
                city: address.city,
                neighborhood: address.neighborhood,
                street: address.street,
                number: address.number,
                complement: address.complement,
                zipCode: address.zipCode,
                state: address.state,
                country: address.country,
                lat: address.lat,
                lng: address.lng,
                diligenceId: address.diligenceId,
            })));
        });
    }
    openModal() {
        const ref = this.dialog.open(NewAddressModal, {
            width: '1200px',
            height: '500px',
            data: {}
        });
        ref.afterClosed().subscribe(result => {
            if (result.success) {
                this.localAddresses.set([...this.addresses(), result.data]);

                this.newAddressCreated.set(true)
            }
        });
    }
    deleteNewAddress() {
        this.localAddresses.set(this.localAddresses().filter(address => !address.new))
    }
}