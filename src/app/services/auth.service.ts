import { Injectable, signal, computed, inject } from '@angular/core';
import { of, delay, tap } from 'rxjs';
import { LoginDTO } from '../DTOS/login.dto';
import { RegisterDTO } from '../DTOS/register.dto';
import { Router } from '@angular/router';

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

const MOCK_USER: User = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3n001',
    username: 'Gabriel Grote',
    email: 'gabriel@teste.com',
    role: 'admin',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _currentUser = signal<User | null>(null);
    currentUser = this._currentUser.asReadonly();
    isLoggedIn = computed(() => !!this._currentUser());
    private router = inject(Router);

    async login(loginDto: LoginDTO) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const result = { success: true, data: { user: MOCK_USER } }
        this._currentUser.set(result.data.user)
        return result
    }
    async register(registerDto: RegisterDTO) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const result = { success: true, data: { user: MOCK_USER } }
        return result
    }
    async sendEmail(email: string) {
        console.log(email)
        await new Promise(resolve => setTimeout(resolve, 800));
        const result = { success: true, data: { code: 123456 } }
        return result
    }
    async sendCode(code: string, email: string) {
        console.log(email, code)
        await new Promise(resolve => setTimeout(resolve, 800));
        const result = { success: true }
        return result
    }
    async updatePassword(password: string, passwordConfirm: string, email: string) {
        console.log(email, password, passwordConfirm)
        await new Promise(resolve => setTimeout(resolve, 800));
        const result = { success: true }
        return result
    }

    logout() {
        this._currentUser.set(null)
        return this.router.parseUrl('/auth');
    }

    checkSession() {
        return of({ user: MOCK_USER }).pipe(
            delay(300),
            tap(({ user }) => {
                this._currentUser.set(user);
            })
        );
    }
}