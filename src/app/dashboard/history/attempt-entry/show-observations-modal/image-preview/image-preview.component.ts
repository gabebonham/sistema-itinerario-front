import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-image-preview',
    imports: [MatDialogModule, MatIconModule,],
    templateUrl: './image-preview.component.html',
})
export class ImagePreviewComponent {
    imageUrl = signal<string | undefined>(undefined)
    constructor(
        public dialogRef: MatDialogRef<ImagePreviewComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.imageUrl.set(data.imageUrl)
    }
    confirm() {
        this.dialogRef.close(true);
    }
}
