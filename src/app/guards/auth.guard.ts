import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (!user) {
        return router.parseUrl('/auth');
    }

    const plannerRoutes = [
        '/dashboard/tentativas',
        '/dashboard/notificadores',
        '/dashboard/historico',
        '/dashboard/planejamento',
    ];

    const notificatorRoutes = [
        '/dashboard/notificacoes',
        '/dashboard/campo',
    ];

    if (user.role === 'Planejador' && notificatorRoutes.includes(state.url)) {
        return router.parseUrl('/dashboard/tentativas');
    }

    if (user.role === 'Notificador' && plannerRoutes.includes(state.url)) {
        return router.parseUrl('/dashboard/notificacoes');
    }

    return true;
};