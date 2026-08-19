import { Component, inject, input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Attempt } from '../../../models/attempt';
import { Diligence } from '../../../models/diligence';


@Component({
    selector: 'app-attempt-entry',
    imports: [CommonModule, MatSidenavModule, MatIconModule,MatExpansionModule],
    templateUrl: './attempt-entry.component.html',
})
export class AttemptEntryComponent implements OnInit {
    attempt = input.required<Attempt>()
    lastDiligence?: Diligence

    ngOnInit(): void {
        if (this.attempt().diligences) {
            this.lastDiligence = this.getDiligencesInAscOrder(this.attempt().diligences!).at(-1);
        }
    }
    onClick() {

    }
    getDiligencesInAscOrder(diligences: Diligence[]) {
        return [...diligences].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

}
