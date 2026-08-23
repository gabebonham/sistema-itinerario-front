import { Component, inject, input, Input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../services/auth.service';
import { NgClass } from '@angular/common';
import { RegisterDTO } from '../../../DTOS/register.dto';

type Roles = 'Notificador' | 'Planejador'
@Component({
    selector: 'app-register-section',
    templateUrl: './register-section.component.html',
    standalone: true,
    imports: [NgClass, MatTabsModule, MatIconModule, MatSnackBarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class RegisterSectionComponent {
    showPassword = signal(false)
    showPasswordConfirm = signal(false)
    role = signal<Roles | undefined>(undefined);

    isLoading = signal(false)

    private authService = inject(AuthService);

    private snackBar = inject(MatSnackBar);
    private fb = inject(FormBuilder);
    registerForm = this.fb.group({
        email: [
            '',
            [
                Validators.required,
                Validators.email
            ]
        ],

        name: [
            '',
            [
                Validators.required,
                Validators.minLength(5)
            ]
        ],

        password: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
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
    passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const passwordConfirm = control.get('passwordConfirm')?.value;

        if (password !== passwordConfirm) {
            return { passwordMismatch: true };
        }

        return null;
    };
    validateErrors(): boolean {
        const email = this.registerForm.controls.email;
        const name = this.registerForm.controls.name;
        const password = this.registerForm.controls.password;
        const passwordConfirm = this.registerForm.controls.passwordConfirm;

        if (email.hasError('required')) {
            this.showToast('O email é obrigatório.');
            return true;
        }

        if (email.hasError('email')) {
            this.showToast('Email inválido.');
            return true;
        }

        if (name.hasError('required')) {
            this.showToast('O nome é obrigatório.');
            return true;
        }

        if (name.hasError('minlength')) {
            this.showToast('O nome deve ter no mínimo 5 caracteres.');
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

        if (passwordConfirm.hasError('required')) {
            this.showToast('Confirme sua senha.');
            return true;
        }

        if (password.value !== passwordConfirm.value) {
            this.showToast('As senhas não coincidem.');
            return true;
        }

        return false;
    }
    async register() {
        if (this.role() === undefined) {
            this.showToast('Selecione um perfil.');
            return;
        }

        if (this.validateErrors()) {
            return;
        }

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);

        const registerDto: RegisterDTO = {
            email: this.registerForm.value.email!,
            name: this.registerForm.value.name!,
            role: this.role()!,
            password: this.registerForm.value.password!,
        };

        try {
            const result = await this.authService.register(registerDto);

            if (result.success) {
                this.showToast('Registro feito com sucesso!');

                await new Promise(resolve => setTimeout(resolve, 800));

                window.location.reload();
            } else {
                this.showToast('Erro ao fazer cadastro.');
            }
        } finally {
            this.isLoading.set(false);
        }
    }
    setRole(role: Roles) {
        this.role.set(role)
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
    toggleShowPasswordConfirm() {
        this.showPasswordConfirm.set(!this.showPasswordConfirm())

    }
}
