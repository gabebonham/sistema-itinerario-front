import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const meResult = await authService.me();
    if (meResult.success) {
      return router.parseUrl('/dashboard');
    }
    return true;
  } catch {
    return true;
  }
};