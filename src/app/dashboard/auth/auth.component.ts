import { Component, inject, input, Input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginSectionComponent } from "./login-section/login-section.component";
import { RegisterSectionComponent } from './register-section/register-section.component';
import { ForgotPasswordSectionComponent } from "./forgot-password/forgot-password-section.component";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    standalone: true,
    imports: [ForgotPasswordSectionComponent, RegisterSectionComponent, MatTabsModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, LoginSectionComponent, ForgotPasswordSectionComponent],
})
export class AuthComponent {
    currentSection = signal('login')
    showPassword = false
    isLoading = signal(false)

    private fb = inject(FormBuilder);
    loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
    });

    changeSection(section: string) {
        this.currentSection.set(section)
    }

}
