import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // We return an Observable that emits true or a UrlTree (the redirect path)
  // This is the standard, reactive way to handle auth guards in Angular
  return authService.user$.pipe(
    take(1), // Ensure we only take the current state and then complete
    map(user => {
      if (user) {
        return true; // Authenticated
      } else {
        // Return a UrlTree to tell the router where to go instead
        return router.createUrlTree(['/login']);
      }
    })
  );
};