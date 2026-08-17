import { Component, inject, Inject, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttemptsService } from '../../../services/attempts.service';
import { CreateAttemptDTO } from '../../../DTOS/create-attempt.dto';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-new-window-modal',
    imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatSelectModule, MatFormFieldModule, MatInputModule],
    templateUrl: './new-window-modal.component.html',
})
export class NewWindowModal {
    isLoading = false
    dateValue: string = ''
    fromTime: string = ''
    toTime: string = ''
    
    attemptsService = inject(AttemptsService)
    windowsLeft:string[] = []
    selectedWindow:string=''
    private fb = inject(FormBuilder);
    form = this.fb.group({
        agentName: ['', Validators.required],
        debtorName: ['', Validators.required],
        protocol: ['', Validators.required],
        installmentsNumber: [0, [Validators.required, Validators.min(1)]],
    });
    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<NewWindowModal, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.windowsLeft = data.windowsLeft
     }

    errors: string[] = []

    confirm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errors = this.getFormErrors();
            return;
        }
        this.isLoading = true;
        this.errors = [];
        const createItineraryDto: CreateAttemptDTO = {
            agentName: this.form.value.agentName!,
            protocol: this.form.value.protocol!,
            debtorName: this.form.value.debtorName!,
            installmentsNumber: this.form.value.installmentsNumber!,
        }
        this.attemptsService.create(createItineraryDto).then((result) => {
            this.isLoading = false;
            if (result.success) {
                this.dialogRef.close(true);
                this.router.navigate(['/dashboard/itinerario/' + result.data.id]);
            } else {
                this.errors = ['Não foi possível criar o itinerário.'];
            }
        }).catch((err: any) => {
            this.isLoading = false;
            this.errors = ['Erro ao criar itinerário. Tente novamente.'];
        });
    }
    private getFormErrors(): string[] {
        const labels: Record<string, string> = {
            agentName: 'Nome do Agente',
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
    onDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;

        this.dateValue = value;
        input.value = value;
    }
    onFromTime(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 2) value = `${value.slice(0, 2)}:${value.slice(2)}`;

        this.fromTime = value;
        input.value = value;
    }
    onToTime(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 2) value = `${value.slice(0, 2)}:${value.slice(2)}`;

        this.toTime = value;
        input.value = value;
    }
}