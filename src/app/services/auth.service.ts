import { Injectable, signal, computed, inject } from '@angular/core';
import { LoginDTO } from '../DTOS/login.dto';
import { RegisterDTO } from '../DTOS/register.dto';
import { Router } from '@angular/router';
import { User } from '../models/user';


const MOCK_USER: User = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3n001',
    name: 'Gabriel Grote',
    email: 'gabriel@teste.com',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: '123'
};

@Injectable({ providedIn: 'root' })
export class AuthService {
    private router = inject(Router);

    async login(loginDto: LoginDTO) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const result = { success: true, data: { user: MOCK_USER } }

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
        return this.router.parseUrl('/auth');
    }

    async me() {
        await new Promise(resolve => setTimeout(resolve, 800));
        const result = { success: false, data: { user: MOCK_USER } }
        return result
    }
}