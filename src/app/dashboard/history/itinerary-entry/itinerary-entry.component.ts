import { Component, inject, input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Itinerary } from '../../../models/itinerary';
import { Attempt } from '../../../models/attempt';


@Component({
    selector: 'app-itinerary-entry',
    imports: [CommonModule, MatSidenavModule, MatIconModule,MatExpansionModule],
    templateUrl: './itinerary-entry.component.html',
})
export class ItineraryEntryComponent implements OnInit {
    itinerary = input.required<Itinerary>()
    lastAttempt?: Attempt

    ngOnInit(): void {
        if (this.itinerary().attempts) {
            this.lastAttempt = this.getAttemptsInAscOrder(this.itinerary().attempts!).at(-1);
        }
    }
    onClick() {

    }
    getAttemptsInAscOrder(attempts: Attempt[]) {
        return [...attempts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

}
