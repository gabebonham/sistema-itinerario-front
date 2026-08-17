import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddressesEntryComponent } from './address-entry/addresses-entry.component';
import { Address } from '../../../models/address';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-addresses-section',
    imports: [MatSidenavModule, AddressesEntryComponent, DragDropModule],
    templateUrl: './addresses-section.component.html',
})
export class AddressesSectionComponent implements OnChanges {
    @Input() addresses: Address[] = [];
    ngOnChanges(changes: SimpleChanges): void {
    }
    drop(event: CdkDragDrop<typeof this.addresses>) {
        moveItemInArray(
            this.addresses,
            event.previousIndex,
            event.currentIndex
        );
    }
}
