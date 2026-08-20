import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttemptService } from '../../../../services/attempt.service';
import { CreateAttemptDTO } from '../../../../DTOS/create-itinerary.dto';


@Component({
    selector: 'app-new-attempt-modal',
    imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './new-attempt-modal.component.html',
})
export class NewAttemptModal {
    isLoading = false
    attemptService = inject(AttemptService)
    private fb = inject(FormBuilder);
    form = this.fb.group({
        notificatorName: ['', Validators.required],
        debtorName: ['', Validators.required],
        protocol: ['', Validators.required],
        installmentsNumber: [0, [Validators.required, Validators.min(1)]],
    });
    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<NewAttemptModal, boolean>,
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
        const createAttemptDto: CreateAttemptDTO = {
            notificatorName: this.form.value.notificatorName!,
            protocol: this.form.value.protocol!,
            debtorName: this.form.value.debtorName!,
            installmentsNumber: this.form.value.installmentsNumber!,
        }
        this.attemptService.create(createAttemptDto).then((result) => {
            this.isLoading = false;
            if (result.success) {
                this.dialogRef.close(true);
                this.router.navigate(['/dashboard/tentativas/' + result.data.id]);
            } else {
                this.errors = ['Não foi possível criar a tentativa.'];
            }
        }).catch((err) => {
            this.isLoading = false;
            this.errors = ['Erro ao criar tentativa. Tente novamente.'];
        });
    }
    private getFormErrors(): string[] {
        const labels: Record<string, string> = {
            notificatorName: 'Nome do Notificador',
            debtor: 'Nome do Devedor',
            protocol: 'Protocolo',
            installmentsNumber: 'Parcelas em atraso',
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
                if (key === 'installmentsNumber' && typeof control.value !== 'number') {
                    messages.push(`${label} deve ser um número.`);
                }
            }
        }

        return messages;
    }
    cancel() {
        this.dialogRef.close(false);
    }

}
