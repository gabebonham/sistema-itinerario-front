import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const meResult = await authService.me();
    if (meResult.success) {
      return true;
    }
    return router.parseUrl('/auth');
  } catch {
    return router.parseUrl('/auth');
  }
};