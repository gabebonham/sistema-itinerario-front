import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttemptService } from '../../../../services/attempt.service';
import { CreateAttemptDTO } from '../../../../DTOS/create-itinerary.dto';
import { DebtorService } from '../../../../services/debtor.service';
import { CreateDebtorDTO } from '../../../../DTOS/create-debtor.dto';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-new-attempt-modal',
    imports: [MatDialogModule, MatSelectModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './new-attempt-modal.component.html',
})
export class NewAttemptModal implements OnInit {
    isLoading = signal(false)
    attemptService = inject(AttemptService)
    debtorService = inject(DebtorService)

    private fb = inject(FormBuilder);
    form = this.fb.group({
        debtorName: ['', Validators.required],
        debtorRg: ['', Validators.required],
        debtorCpfCnpj: ['', Validators.required],
        protocol: ['', Validators.required],
    });
    errors: string[] = []
    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<NewAttemptModal, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    ngOnInit(): void {

    }

    confirm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errors = this.getFormErrors();

            return;
        }
        this.isLoading.set(true);
        this.errors = [];

        const createDebtorDto: CreateDebtorDTO = {
            name: this.form.value.debtorName!,
            cpfCnpj: this.form.value.debtorCpfCnpj!,
            rg: this.form.value.debtorRg!,
        }
        this.debtorService.create(createDebtorDto).then(result => {
            if (result.success) {
                this.createAttempt(result.data.id)
            } else {
                this.errors = ['Não foi possível criar devedor.'];
            }
        })
    }
    private createAttempt(debtorId: string) {
        const dto: CreateAttemptDTO = {
            protocol: this.form.value.protocol!,
            debtorId,
        }
        this.attemptService.create(dto).then((result) => {
        this.isLoading.set(false);

            if (result.success) {
                this.dialogRef.close(true);
                this.router.navigate(['/dashboard/tentativas/' + result.data.id]);
            } else {
                this.errors = ['Não foi possível criar a tentativa.'];
            }
        }).catch((err) => {
        this.isLoading.set(false);

            this.errors = ['Erro ao criar tentativa. Tente novamente.'];
        });
    }
    private getFormErrors(): string[] {
        const labels: Record<string, string> = {
            notificatorName: 'Nome do Notificador',
            debtorName: 'Nome do Devedor',
            protocol: 'Protocolo',
            debtorAddress: 'Endereço do Devedor',
            debtorRg: 'RG do Devedor',
            debtorCpfCnpj: 'CPF/CNPJ do Devedor',
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
