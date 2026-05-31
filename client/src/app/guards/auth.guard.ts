import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  // MUST call inject() synchronously at the very top!
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use our bulletproof method that waits for Firebase to properly wake up
  const token = await authService.getToken();

  if (token) {
    return true; // They are authenticated, let them pass!
  } else {
    router.navigate(['/login']); // No token found, kick them out
    return false;
  }
};