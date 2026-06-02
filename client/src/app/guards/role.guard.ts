import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as Array<string>;

  return authService.getUserProfile().pipe(
    map(userDb => {
      // 1. Check if the user has access
      if (userDb && userDb.role && allowedRoles.includes(userDb.role)) {
        return true;
      }

      // 2. Access Denied: User is logged in but doesn't have the right role
      console.warn("Unauthorized access attempt. Redirecting based on role.");
      
      // Determine redirection based on the role they DO have
      if (userDb?.role === 'ADMIN') {
        return router.createUrlTree(['/admin/dashboard']);
      } else if (userDb?.role === 'EMPLOYEE') {
        return router.createUrlTree(['/employee/dashboard']);
      } else {
        return router.createUrlTree(['/dashboard']);
      }
    }),
    catchError((err) => {
      console.error("Role Guard Auth Error (likely not logged in):", err);
      
      // If the error is a 401/403, it means they are not authorized/logged in
      // Redirect to login
      return of(router.createUrlTree(['/login']));
    })
  );
};