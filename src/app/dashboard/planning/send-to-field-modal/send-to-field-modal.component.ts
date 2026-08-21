import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiligencesService } from '../../../services/diligences.service';


@Component({
    selector: 'app-send-to-field-modal',
    imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './send-to-field-modal.component.html',
})
export class SendToFieldModal {
    isLoading = false
    diligencesService = inject(DiligencesService)
    private fb = inject(FormBuilder);
    form = this.fb.group({
        observation: [''],
    });
    constructor(
        public dialogRef: MatDialogRef<SendToFieldModal, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    errors: string[] = []
    confirm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errors = this.getFormErrors();

            return;
        }
        this.isLoading = true;
        this.errors = [];
        const diligenceToCreate = {
            ...this.data.diligence,
            observation: this.form.value.observation!
        }
        this.diligencesService.create(diligenceToCreate).then((result) => {
            this.isLoading = false;
            if (result.success) {
                this.dialogRef.close(true);
            } else {
                this.errors = ['Não foi possível criar diligência.'];
            }
        }).catch((err) => {
            this.isLoading = false;
            this.errors = ['Erro ao criar diligência. Tente novamente.'];
        });
    }
    private getFormErrors(): string[] {
        const labels: Record<string, string> = {
            observation: 'Observação',
        };

        const messages: string[] = [];

        for (const key of Object.keys(this.form.controls)) {
            const control = this.form.get(key)!;
            if (control.invalid) {
                const label = labels[key] ?? key;
                if (control.hasError('required')) {
                    messages.push(`${label} é obrigatório.`);
                }
                if (control.hasError('min')) {
                    messages.push(`${label} deve ser maior que 0.`);
                }

            }
        }

        return messages;
    }
    cancel() {
        this.dialogRef.close(false);
    }

}
