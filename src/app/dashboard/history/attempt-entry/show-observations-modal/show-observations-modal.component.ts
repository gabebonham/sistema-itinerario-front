import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-show-observations-modal',
    imports: [MatDialogModule, MatIconModule, ],
    templateUrl: './show-observations-modal.component.html',
})
export class ShowObservationsModal {
    isLoading = false
    generalObservations = signal<string[]>([])
    factsObservations = signal<string[]>([])
    propertyObservations = signal<string[]>([])
    plannerObservations = signal<string|undefined>(undefined)
    constructor(
        public dialogRef: MatDialogRef<ShowObservationsModal, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.generalObservations.set(data.generalObservations)
        this.factsObservations.set(data.factsObservations)
        this.propertyObservations.set(data.propertyObservations)
        this.plannerObservations.set(data.plannerObservations)
     }
    confirm() {
        this.dialogRef.close(true);
    }

}
