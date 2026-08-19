import { Component, inject, Inject, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DiligencesService } from '../../../../services/diligences.service';
import { DiligenceOrdinal, WindowEntry } from '../../../../models/diligence';

@Component({
    selector: 'app-new-window-modal',
    imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatInputModule],
    templateUrl: './new-window-modal.component.html',
})
export class NewWindowModal {
    isLoading = false;
    errors: string[] = [];

    windowsLeft: string[] = [];

    diligencesService = inject(DiligencesService);
    private fb = inject(FormBuilder);

    form = this.fb.group({
        fromTime: ['', Validators.required],
        toTime: ['', Validators.required],
        dateValue: ['', Validators.required],
        window: ['', Validators.required],
    });

    constructor(
        public dialogRef: MatDialogRef<
            NewWindowModal,
            { success: boolean; data: WindowEntry | null }
        >,
        @Inject(MAT_DIALOG_DATA) public data: { windowsLeft: string[], diligenceOrdinal:DiligenceOrdinal }
    ) {
        this.windowsLeft = data.windowsLeft;
    }

    confirm(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errors = this.getFormErrors();
            return;
        }

        this.isLoading = true;
        this.errors = [];

        const createWindowDto: any = {
            fromTime: this.form.value.fromTime!,
            toTime: this.form.value.toTime!,
            dateValue: this.form.value.dateValue!,
        };

        this.diligencesService.create(createWindowDto)
            .then(result => {
                this.isLoading = false;

                if (result.success) {
                    this.dialogRef.close({
                        success: true,
                        data: {
                            finish: new Date(),
                            start: new Date(),
                            new: true,
                            window: this.form.value.window!,
                            diligenceOrdinal:this.data.diligenceOrdinal
                        }
                    });
                } else {
                    this.errors = [
                        'Não foi possível criar a tentativa.'
                    ];
                }
            })
            .catch(() => {
                this.isLoading = false;
                this.errors = [
                    'Erro ao criar tentativa. Tente novamente.'
                ];
            });
    }

    private getFormErrors(): string[] {
        const labels: Record<string, string> = {
            fromTime: 'De (Hora)',
            toTime: 'Até (Hora)',
            window: 'Janela',
            dateValue: 'Dia',
        };

        const messages: string[] = [];

        for (const key of Object.keys(this.form.controls)) {
            const control = this.form.get(key)!;

            if (control.invalid && control.hasError('required')) {
                messages.push(`${labels[key] ?? key} é obrigatório.`);
            }
        }

        return messages;
    }

    cancel(): void {
        this.dialogRef.close({
            success: false,
            data: null
        });
    }
    onDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;

        input.value = value;
    }
    onFromTime(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 2) value = `${value.slice(0, 2)}:${value.slice(2)}`;

        input.value = value;
    }
    onToTime(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 2) value = `${value.slice(0, 2)}:${value.slice(2)}`;

        input.value = value;
    }
}