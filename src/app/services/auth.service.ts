import { Injectable, signal, computed } from '@angular/core';
import { of, delay, tap } from 'rxjs';

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

const MOCK_USER: User = {
    id: '1',
    username: 'Gabriel Grote',
    email: 'gabriel@teste.com',
    role: 'Notificador',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _currentUser = signal<User | null>(null);
    currentUser = this._currentUser.asReadonly();
    isLoggedIn = computed(() => !!this._currentUser());

    login(email: string, password: string) {
        return of({ user: MOCK_USER }).pipe(
            delay(500),
            tap(({ user }) => this._currentUser.set(user))
        );
    }

    logout() {
        return of(void 0).pipe(
            delay(200),
            tap(() => this._currentUser.set(null))
        );
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