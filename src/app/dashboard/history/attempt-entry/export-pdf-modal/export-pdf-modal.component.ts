import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttemptService } from '../../../../services/attempt.service';


@Component({
    selector: 'app-export-pdf-modal',
    imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './export-pdf-modal.component.html',
})
export class ExportPdfModal {
    isLoading = false
    attemptService = inject(AttemptService)
    private fb = inject(FormBuilder);
    form = this.fb.group({
        observation: [''],
    });
    constructor(
        public dialogRef: MatDialogRef<ExportPdfModal, {observation?:string|null}>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    errors: string[] = []
    confirm() {
        this.dialogRef.close({observation:this.form.value.observation});
        
    }
    cancel() {
        this.dialogRef.close({});
    }

}
