import { Injectable, signal, computed, inject } from '@angular/core';
import { LoginDTO } from '../DTOS/login.dto';
import { RegisterDTO } from '../DTOS/register.dto';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ApiService } from './api';
import { ApiResponse } from '../DTOS/api-response';
import { LoginResponse } from '../DTOS/login-response.dto';
import { UserResponse } from '../DTOS/user-response.dto';


const MOCK_USER: User = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3n001',
    name: 'Gabriel Grote',
    email: 'gabriel@teste.com',
    role: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: '123'
};

@Injectable({ providedIn: 'root' })
export class AuthService {

    private api = inject(ApiService);

    private _checkingAuth = signal(true);
    readonly checkingAuth = this._checkingAuth.asReadonly();

    private _currentUser = signal<UserResponse | null>(null);
    readonly currentUser = this._currentUser.asReadonly();

    async checkAuth(): Promise<boolean> {
        try {
            const result = await this.me();

            if (result.success && result.data) {
                this._currentUser.set(result.data);
                return true;
            }

            this._currentUser.set(null);
            return false;

        } catch {
            this._currentUser.set(null);
            return false;

        } finally {
            this._checkingAuth.set(false);
        }
    }

    async me(): Promise<ApiResponse<UserResponse>> {
        this._checkingAuth.set(true);

        try {
            return await this.api.get<UserResponse>('me');
        } finally {
            this._checkingAuth.set(false);
        }
    }

    async login(
        dto: LoginDTO
    ): Promise<ApiResponse<LoginResponse>> {

        const result = await this.api.post<LoginResponse>(
            'login',
            dto
        );

        if (result.success) {
            await this.checkAuth();
        }

        return result;
    }

    async register(
        dto: RegisterDTO
    ): Promise<ApiResponse<null>> {

        return this.api.post<null>('register', dto);
    }

    async sendEmail(
        email: string
    ): Promise<ApiResponse<null>> {

        return this.api.post<null>(
            'forgot-password/send-email',
            { email }
        );
    }

    async sendCode(
        code: string,
        email: string
    ): Promise<ApiResponse<null>> {

        return this.api.post<null>(
            'forgot-password/validate-code',
            { email, code }
        );
    }

    async updatePassword(
        password: string,
        code: number,
        email: string
    ) {

        return this.api.patch<null>(
            'forgot-password/update-password',
            {
                email,
                code,
                password
            }
        );
    }

    async logout() {

        const result = await this.api.post<null>('logout');

        this._currentUser.set(null);

        return result;
    }
}