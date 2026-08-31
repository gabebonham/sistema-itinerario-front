import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiligencesService } from '../../../services/diligences.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Diligence } from '../../../models/diligence';


@Component({
    selector: 'app-send-to-field-modal',
    imports: [MatSnackBarModule,MatSelectModule,MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    templateUrl: './send-to-field-modal.component.html',
})
export class SendToFieldModal implements OnInit {
    private snackBar = inject(MatSnackBar);
    isLoading = signal(false)
    diligencesService = inject(DiligencesService)
    userService = inject(UserService)
    notificators = signal<{id:string, name:string}[]>([])
    notificator = signal<{id:string, name:string}|undefined>(undefined)
    private fb = inject(FormBuilder);
    form = this.fb.group({
        observation: [''],
    });
    constructor(
        public dialogRef: MatDialogRef<SendToFieldModal, Diligence|null>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    ngOnInit(): void {
        this.userService.getAllByRole(1, 100, 'Notificador').then(result => {
            if (result.success) {
                const notificators = result.data.data.map(userResponse => ({
                    id: userResponse.id,
                    name: userResponse.name,
                }) )
                this.notificators.set(notificators)
            } else {
                this.showToast("Erro ao carregar notificadores.")
            }

        })
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
    errors: string[] = []
    confirm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.errors = this.getFormErrors();

            return;
        }
        this.isLoading.set(true);
        this.errors = [];
        const diligenceToCreate = {
            ...this.data.diligence,
            plannerObservations: this.form.value.observation!,
            notificatorId:this.notificator()?.id,
            notificatorName:this.notificator()?.name
        }
        this.diligencesService.create(diligenceToCreate).then((result) => {
        this.isLoading.set(false);
            if (result.success) {
                this.dialogRef.close(result.data);
            } else {
                this.errors = [result.error];
            }
        }).catch((err) => {
        this.isLoading.set(false);

            this.errors = [err];
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
        this.dialogRef.close(null);
    }

}
