import { Component, inject, input, Input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../services/auth.service';
import { LoginDTO } from '../../../DTOS/login.dto';

@Component({
    selector: 'app-login-section',
    templateUrl: './login-section.component.html',
    standalone: true,
    imports: [MatTabsModule, MatIconModule, MatSnackBarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class LoginSectionComponent {
    showPassword = signal(false)
    isLoading = signal(false)

    private authService = inject(AuthService);

    private snackBar = inject(MatSnackBar);
    private fb = inject(FormBuilder);
    loginForm = this.fb.group({
        email: [
            '',
            [
                Validators.required,
                Validators.email
            ]
        ],

        password: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
                )
            ]
        ]
    });
    constructor(private router: Router) {
    }
    validateErrors(): boolean {
        const email = this.loginForm.controls.email;
        const password = this.loginForm.controls.password;

        if (email.hasError('required')) {
            this.showToast('O email é obrigatório.');
            return true;
        }

        if (email.hasError('email')) {
            this.showToast('Email inválido.');
            return true;
        }

        if (password.hasError('required')) {
            this.showToast('A senha é obrigatória.');
            return true;
        }

        if (password.hasError('minlength')) {
            this.showToast('A senha deve conter no mínimo 8 caracteres.');
            return true;
        }

        if (password.hasError('pattern')) {
            this.showToast(
                'A senha deve conter letra maiúscula, minúscula e número.'
            );
            return true;
        }

        return false;
    }
    login() {
        if (this.validateErrors()) {
            return;
        }

        this.isLoading.set(true);

        const loginDto: LoginDTO = {
            email: this.loginForm.value.email!,
            password: this.loginForm.value.password!,
        };

        this.authService.login(loginDto)
            .then(result => {
                if (result.success) {
                    if (result.data.user.role == 'Notificador')
                        this.router.navigate(['/dashboard/notificacoes']);
                    else
                        this.router.navigate(['/dashboard/tentativas']);
                } else {
                    this.showToast(result.error);
                }
            })
            .catch((err) => {
                console.log(err)
                this.showToast('Erro ao fazer login.');
            })
            .finally(() => {
                this.isLoading.set(false);
            });
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
    toggleShowPassword() {
        this.showPassword.set(!this.showPassword())
    }
}
