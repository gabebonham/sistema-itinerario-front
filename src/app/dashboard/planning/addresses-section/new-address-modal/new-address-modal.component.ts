import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttemptService } from '../../../../services/attempt.service';
import { AddressEntry } from '../../../../models/address';
import { CreateAttemptDTO } from '../../../../DTOS/create-itinerary.dto';


@Component({
    selector: 'app-new-address-modal',
    imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './new-address-modal.component.html',
})
export class NewAddressModal {
    isLoading = false
    attemptService = inject(AttemptService)
    private fb = inject(FormBuilder);
    form = this.fb.group({
        address: ['', Validators.required],
    });
    constructor(
        public dialogRef: MatDialogRef<NewAddressModal, { success: boolean, data: AddressEntry | null }>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    errors: string[] = []
    confirm() {
        // só pra ter referencia de como vai ser, nao vai ser esse fluxo com essas models
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errors = this.getFormErrors();

            return;
        }
        this.isLoading = true;
        this.errors = [];
        const createAttemptDto: CreateAttemptDTO = {
            debtorId: '',
            protocol: '',
        }
        this.attemptService.create(createAttemptDto).then((result) => {
            this.isLoading = false;
            if (result.success) {
                this.dialogRef.close({
                    success: true, data: {
                        new: true,
                        name: 'Rua Getúlio Vargas, 333',
                        city: 'Esteio',
                        neighborhood: 'Centro',
                        street: 'Rua Getúlio Vargas',
                        number: '333',
                        complement: '',
                        zipCode: '93260-020',
                        state: 'RS',
                        country: 'Brasil',
                        lat: -29.8608,
                        lng: -51.1794,
                    }
                });
            } else {
                this.errors = ['Não foi possível adicionar endereço.'];
            }
        }).catch((err) => {
            this.isLoading = false;
            this.errors = ['Erro ao adicionar endereço. Tente novamente.'];
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
        this.dialogRef.close({ success: false, data: null });
    }

}
