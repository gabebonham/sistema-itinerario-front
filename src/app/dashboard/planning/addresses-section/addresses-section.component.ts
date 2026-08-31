import { Component, computed, EventEmitter, input, Output, signal, effect, output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddressesEntryComponent } from './address-entry/addresses-entry.component';
import { Address, AddressEntry } from '../../../models/address';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewAddressModal } from './new-address-modal/new-address-modal.component';
import { PlaceSuggestion } from '../../../DTOS/place-sugestion';
import { CreateAddressDTO } from '../../../DTOS/create-address.dto';


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
    ready = output()
    localAddresses = signal<AddressEntry[]>([]);
    updatePlace = output<PlaceSuggestion | undefined>()
    buildAddress = output<CreateAddressDTO>()
    constructor(private dialog: MatDialog) {
        this.localAddresses.set(
            this.addresses().map(address => ({
                name: address.name,
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
            }))
        );
    }
    openModal() {
        const ref = this.dialog.open(NewAddressModal, {
            width: '1200px',
            height: '500px',
            data: {}
        });
        ref.afterClosed().subscribe((result: { success: boolean, data: CreateAddressDTO }) => {
            if (result.success) {
                const newEntry = {
                    city: result.data.city,
                    country: result.data.country,
                    lat: result.data.lat,
                    lng: result.data.lng,
                    name: result.data.name,
                    neighborhood: result.data.neighborhood,
                    number: result.data.number,
                    state: result.data.state,
                    street: result.data.street,
                    new: true,
                    zipCode: result.data.zipCode
                } as AddressEntry
                this.localAddresses.update(addresses => [...addresses, newEntry]);

                this.newAddressCreated.set(true)
                this.buildAddress.emit(result.data)
                this.ready.emit()
            }
        });
    }
    deleteNewAddress() {
        this.localAddresses.set(this.localAddresses().filter(address => !address.new))
        this.newAddressCreated.set(false)
    }
}