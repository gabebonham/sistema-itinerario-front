import { Component, inject, input, Input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../services/auth.service';
import { LoginDTO } from '../../../DTOS/login.dto';

@Component({
    selector: 'app-login-section',
    templateUrl: './login-section.component.html',
    standalone: true,
    imports: [MatTabsModule, MatIconModule,MatSnackBarModule, ReactiveFormsModule,MatFormFieldModule, MatInputModule],
})
export class LoginSectionComponent {
    showPassword = signal(false)
    isLoading = signal(false)

    private authService= inject(AuthService);

    private snackBar = inject(MatSnackBar);
    private fb = inject(FormBuilder);
    loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
    constructor(private router:Router) {}

    login() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();

            return;
        }
        this.isLoading.set(true);

        const loginDto: LoginDTO = {
            email:this.loginForm.value.email!,
            password:this.loginForm.value.password!,
        }
        this.authService.login(loginDto).then(result => {
            if (result.success) {
                this.router.navigate(['/dashboard'])
            } else {
                this.showToast("Erro ao fazer login.")
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
    toggleShowPassword(){
        this.showPassword.set(!this.showPassword())
    }
}
