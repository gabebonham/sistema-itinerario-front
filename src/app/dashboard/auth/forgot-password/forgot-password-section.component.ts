import { Component, inject, input, Input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../services/auth.service';
import { LoginDTO } from '../../../DTOS/login.dto';

@Component({
    selector: 'app-forgot-password-section',
    templateUrl: './forgot-password-section.component.html',
    standalone: true,
    imports: [MatTabsModule, MatIconModule, MatSnackBarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class ForgotPasswordSectionComponent {
    showPassword = false
    isLoading = signal(false)
    canNext = signal(true)
    currentForgotPasswordSection = signal('emailSection')

    private authService = inject(AuthService);

    changeSection = output()
    private snackBar = inject(MatSnackBar);
    private fb = inject(FormBuilder);
    emailForm = this.fb.group({
        email: [
            '',
            [
                Validators.required,
                Validators.email
            ]
        ]
    });
    codeForm = this.fb.group({
        code: [
            '',
            [
                Validators.required,
                Validators.maxLength(6),
                Validators.minLength(6)
            ]
        ]
    });
    passwordForm = this.fb.group({
        password: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
                )
            ]
        ],
        passwordConfirm: [
            '',
            [
                Validators.required
            ]
        ]
    });
    constructor(private router: Router) { }

    sendEmail() {
        if (this.emailForm.invalid || this.emailForm.controls.email.hasError('email')) {
            this.emailForm.markAllAsTouched();
            this.showToast('Email é obrigatório no formato correto.');
            return;
        }
        this.isLoading.set(true);

        this.authService.sendEmail(this.emailForm.value.email!).then(result => {
            if (!result.success) {
                this.showToast("Erro ao enviar o código.")
            } else {
                this.currentForgotPasswordSection.set('codeSection')

            }
        })
    }

    sendCode() {
        if (this.codeForm.invalid || this.codeForm.controls.code.hasError('minLenght') || this.codeForm.controls.code.hasError('maxLength')) {
            this.codeForm.markAllAsTouched();
            this.showToast('Código é obrigatório no formato correto.');

            return;
        }

        this.isLoading.set(true);

        this.authService.sendCode(this.codeForm.value.code!, this.emailForm.value.email!).then(result => {
            if (!result.success) {
                this.showToast("Erro ao validar o código.")
            } else {
                this.currentForgotPasswordSection.set('updateSection')

            }
        })
    }
    validatePasswordInput() {
        if (this.passwordForm.controls.password.hasError('required')) {
            this.showToast('A senha é obrigatória.');
            return true;
        }

        if (this.passwordForm.controls.password.hasError('minlength')) {
            this.showToast('A senha deve conter no mínimo 8 caracteres.');
            return true;
        }

        if (this.passwordForm.controls.password.hasError('pattern')) {
            this.showToast(
                'A senha deve conter letra maiúscula, minúscula e número.'
            );
            return true;
        }

        if (this.passwordForm.controls.passwordConfirm.hasError('required')) {
            this.showToast('Confirme sua senha.');
            return true;
        }

        if (this.passwordForm.controls.password.value !== this.passwordForm.controls.passwordConfirm.value) {
            this.showToast('As senhas não coincidem.');
            return true;
        }

        return false;
    }
    updatePassword() {
        if (this.validatePasswordInput()){
            return;
        }
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();

            return;
        }
        this.isLoading.set(true);

        this.authService.updatePassword(this.passwordForm.value.password!, this.passwordForm.value.passwordConfirm!, this.emailForm.value.email!).then(async result => {
            if (!result.success) {
                this.showToast("Erro ao atualizar senha.")
            } else {
                this.showToast('Senha atualizda com sucesso!');

                await new Promise(resolve => setTimeout(resolve, 800));

                window.location.reload();
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
    onChangeSection() {
        this.changeSection.emit()
    }
    nextSection() {
        if (this.currentForgotPasswordSection() == 'emailSection') {
            this.sendEmail()
        } else if (this.currentForgotPasswordSection() == 'codeSection') {
            this.sendCode()
        } else if (this.currentForgotPasswordSection() == 'updateSection') {
            this.updatePassword()
        }
    }
}
