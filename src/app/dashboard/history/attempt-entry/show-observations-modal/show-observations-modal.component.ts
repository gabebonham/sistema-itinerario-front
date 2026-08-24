import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImagePreviewComponent } from './image-preview/image-preview.component';


@Component({
    selector: 'app-show-observations-modal',
    imports: [MatDialogModule, MatIconModule,],
    templateUrl: './show-observations-modal.component.html',
})
export class ShowObservationsModal {
    isLoading = false
    generalObservations = signal<string[]>([])
    imageUrls = signal<string[]>([])
    audioUrl = signal<string|undefined>(undefined)
    factsObservations = signal<string[]>([])
    propertyObservations = signal<string[]>([])
    plannerObservations = signal<string | undefined>(undefined)
    constructor(
        public dialogRef: MatDialogRef<ShowObservationsModal, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog
    ) {
        this.imageUrls.set(data.imageUrls)
        this.audioUrl.set(data.audioUrl)
        this.generalObservations.set(data.generalObservations)
        this.factsObservations.set(data.factsObservations)
        this.propertyObservations.set(data.propertyObservations)
        this.plannerObservations.set(data.plannerObservations)
    }
    confirm() {
        this.dialogRef.close(true);
    }
    openImage(imageUrl:string) {
        this.dialog.open(ImagePreviewComponent, {
            data: {
                imageUrl: imageUrl
            },
            maxWidth: '95vw',
            maxHeight: '95vh',
            panelClass: 'image-dialog'
        });
    }
}
