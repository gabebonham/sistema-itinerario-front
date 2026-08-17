import { Component, computed, EventEmitter, input, Output, signal, effect } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddressesEntryComponent } from './address-entry/addresses-entry.component';
import { Address } from '../../../models/address';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-addresses-section',
    imports: [MatSidenavModule, AddressesEntryComponent, DragDropModule],
    templateUrl: './addresses-section.component.html',
})
export class AddressesSectionComponent {
    addresses = input<Address[]>([]);
    isLoading = input.required<boolean>();

    @Output() orderChanged = new EventEmitter<Address[]>();

    // cópia local editável, sincronizada sempre que o input mudar
    localAddresses = signal<Address[]>([]);

    constructor() {
        effect(() => {
            this.localAddresses.set([...this.addresses()]);
        });
    }
    deleteAddress(id:string) {
        this.localAddresses.set(this.localAddresses().filter(address=>address.id!=id))
    }
    drop(event: CdkDragDrop<Address[]>) {
        const updated = [...this.localAddresses()];
        moveItemInArray(updated, event.previousIndex, event.currentIndex);

        // reatribui o campo `order` de cada item conforme a nova posição
        const reordered = updated.map((address, index) => ({
            ...address,
            order: index + 1, // ou index, dependendo se sua ordem começa em 0 ou 1
        }));

        this.localAddresses.set(reordered);
        this.orderChanged.emit(reordered);
    }
}