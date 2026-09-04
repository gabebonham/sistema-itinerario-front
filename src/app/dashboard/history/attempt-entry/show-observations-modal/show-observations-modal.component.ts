import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { MediaService } from '../../../../services/media.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
    selector: 'app-show-observations-modal',
    imports: [MatDialogModule, MatSnackBarModule, MatIconModule,],
    templateUrl: './show-observations-modal.component.html',
})
export class ShowObservationsModal implements OnInit {
    private snackBar = inject(MatSnackBar);
    isLoading = false
    isLoadingImgs = signal(true)
    isLoadingAudio = signal(true)
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
                this.isLoadingAudio.set(false)
            } else {
                this.showToast("Erro ao carregar áudio.")
                this.isLoadingAudio.set(false)
            }
        })
        this.mediaService.getImagesByDiligenceId(this.data.diligenceId).then(result => {
            if (result.success) {
                this.imageUrls.set(result.data.urls ?? [])
                this.isLoadingImgs.set(false)
            } else {
                this.showToast("Erro ao carregar imagens.")
                this.isLoadingImgs.set(false)
            }
        })
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
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}
