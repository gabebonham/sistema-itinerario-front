import { Component, inject, input, Input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { LoginDTO } from '../../DTOS/login.dto';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginSectionComponent } from "./login-section/login-section.component";
import { RegisterSectionComponent } from './register-section/register-section.component';
import { ForgotPasswordSectionComponent } from "./forgot-password/forgot-password-section.component";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    standalone: true,
    imports: [ForgotPasswordSectionComponent, RegisterSectionComponent, MatTabsModule, MatIconModule, MatSnackBarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, LoginSectionComponent, ForgotPasswordSectionComponent],
})
export class AuthComponent {
    currentSection = signal('login')
    showPassword = false
    isLoading = signal(false)

    private authService= inject(AuthService);

    private snackBar = inject(MatSnackBar);
    private fb = inject(FormBuilder);
    loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
    constructor(private router:Router) {}

    changeSection(section: string) {
        this.currentSection.set(section)
    }
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
}
