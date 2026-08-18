import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItineraryService } from '../../../../services/itinerary.service';
import { CreateItineraryDTO } from '../../../../DTOS/create-itinerary.dto';
import { AddressEntry } from '../../../../models/address';


@Component({
    selector: 'app-new-address-modal',
    imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './new-address-modal.component.html',
})
export class NewAddressModal {
    isLoading = false
    itineraryService = inject(ItineraryService)
    private fb = inject(FormBuilder);
    form = this.fb.group({
        agentName: ['', Validators.required],
        debtorName: ['', Validators.required],
        protocol: ['', Validators.required],
        installmentsNumber: [0, [Validators.required, Validators.min(1)]],
    });
    constructor(
        public dialogRef: MatDialogRef<NewAddressModal, { success: boolean, data: AddressEntry | null }>,
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
        const createItineraryDto: CreateItineraryDTO = {
            agentName: this.form.value.agentName!,
            protocol: this.form.value.protocol!,
            debtorName: this.form.value.debtorName!,
            installmentsNumber: this.form.value.installmentsNumber!,
        }
        this.itineraryService.create(createItineraryDto).then((result) => {
            this.isLoading = false;
            if (result.success) {
                this.dialogRef.close({
                    success: true, data: {
                        new: true,
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
                        attemptId: 'f47ac10b-58cc-4372-a567-0e02b2c3d004',
                        order: 2,
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
            agentName: 'Nome do Notificador',
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
