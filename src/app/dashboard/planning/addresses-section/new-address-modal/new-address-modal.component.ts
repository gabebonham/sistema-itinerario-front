import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttemptService } from '../../../../services/attempt.service';
import { AddressEntry } from '../../../../models/address';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AddressesService } from '../../../../services/addresses.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PlaceSuggestion } from '../../../../DTOS/place-sugestion';
import { CreateAddressDTO } from '../../../../DTOS/create-address.dto';

@Component({
    selector: 'app-new-address-modal',
    imports: [
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
    ],
    templateUrl: './new-address-modal.component.html',
})
export class NewAddressModal implements OnInit {
    isLoading = false
    suggestions = signal<PlaceSuggestion[]>([]);
    suggestion = signal<PlaceSuggestion | undefined>(undefined);
    addressesService = inject(AddressesService)
    attemptService = inject(AttemptService)
    private fb = inject(FormBuilder);
    form = this.fb.group({
        address: ['', Validators.required],
    });
    constructor(
        public dialogRef: MatDialogRef<NewAddressModal, { success: boolean, data: CreateAddressDTO | null }>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    errors = signal<string[]>([])
    ngOnInit(): void {
        this.form.controls.address.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {

                if (typeof value !== 'string') {
                    return;
                }

                this.suggestion.set(undefined);
                this.search(value);
            });
    }
    async search(value?: string | null): Promise<void> {
        if (!value || value.length < 3) {
            this.suggestions.set([]);
            return;
        }

        const result = await this.addressesService.getAddressSugestion(value);

        if (result.success) {
            this.suggestions.set(result.data);
        } else {
            this.suggestions.set([]);
        }
    }
    onAddressSelected(event: MatAutocompleteSelectedEvent): void {
        const suggestion = event.option.value as PlaceSuggestion;

        this.suggestion.set(suggestion)
    }
    displaySuggestion(suggestion: PlaceSuggestion | null): string {
        return suggestion?.description ?? '';
    }
    async confirm(): Promise<void> {
        this.errors.set([]);

        const suggestion = this.suggestion();

        if (!suggestion) {
            this.errors.set(['Endereço deve ser selecionado.']);
            return;
        }

        this.isLoading = true;

        try {
            const result = await this.addressesService.getAddressPlace(
                suggestion.placeId
            );

            if (result.success) {
                console.log(result.data);

                const addressToCreate = {
                    city:result.data.city,
                    country:result.data.country,
                    lat:result.data.latitude,
                    lng:result.data.longitude,
                    name:result.data.name,
                    neighborhood:result.data.neighborhood,
                    number:result.data.number,
                    state:result.data.state,
                    street:result.data.street,
                    zipCode:result.data.zipCode
                } as CreateAddressDTO
                this.dialogRef.close({
                    success: true,
                    data: addressToCreate
                });
            } else {
                this.errors.set([
                    result.error ?? 'Não foi possível buscar o endereço.'
                ]);
            }
        } catch {
            this.errors.set([
                'Erro ao buscar o endereço. Tente novamente.'
            ]);
        } finally {
            this.isLoading = false;
        }
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
