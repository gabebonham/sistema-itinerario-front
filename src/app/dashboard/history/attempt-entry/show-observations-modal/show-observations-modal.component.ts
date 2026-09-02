import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { MediaService } from '../../../../services/media.service';


@Component({
    selector: 'app-show-observations-modal',
    imports: [MatDialogModule, MatIconModule,],
    templateUrl: './show-observations-modal.component.html',
})
export class ShowObservationsModal implements OnInit {
    isLoading = false
    generalObservations = signal<string[]>([])
    imageUrls = signal<string[]>([])
    audioUrls = signal<string[]>([])
    factsObservations = signal<string[]>([])
    propertyObservations = signal<string[]>([])
    plannerObservations = signal<string | undefined>(undefined)
    mediaService = inject(MediaService)
    constructor(
        public dialogRef: MatDialogRef<ShowObservationsModal, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog
    ) {
        this.generalObservations.set(data.generalObservations)
        this.factsObservations.set(data.factsObservations)
        this.propertyObservations.set(data.propertyObservations)
        this.plannerObservations.set(data.plannerObservations)
    }
    ngOnInit(): void {
        this.mediaService.getAudioByDiligenceId(this.data.diligenceId).then(result => {
            if (result.success) {
                this.audioUrls.set(result.data.urls ?? [])
            }
        })
        this.mediaService.getImagesByDiligenceId(this.data.diligenceId).then(result => {
            if (result.success) {
                this.imageUrls.set(result.data.urls ?? [])
            }
        })
        console.log('asdf')
        console.log(this.audioUrls())
        console.log(this.imageUrls())
    }
    confirm() {
        this.dialogRef.close(true);
    }
    openImage(imageUrl: string) {
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
