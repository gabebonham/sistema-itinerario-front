import { Component, inject, input, Input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
    loginForm = this.fb.group({
        email: ['', Validators.required],
        name: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
    });
    constructor(private router: Router) { }

    register() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();

            return;
        }
        this.isLoading.set(true);

        const registerDto: RegisterDTO = {
            email: this.loginForm.value.email!,
            name: this.loginForm.value.email!,
            role: this.role.toString(),
            password: this.loginForm.value.password!,
        }
        this.authService.register(registerDto).then(result => {
            if (result.success) {
                this.router.navigate(['/dashboard'])
            } else {
                this.showToast("Erro ao fazer cadastro.")
            }
        })
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
