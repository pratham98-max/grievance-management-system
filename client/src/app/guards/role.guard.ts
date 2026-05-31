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
      if (allowedRoles.includes(userDb.role)) {
        return true; 
      }
      
      // Fix the paths to match app.routes.ts exactly!
      if (userDb.role === 'ADMIN') {
        router.navigate(['/admin/dashboard']);
      } else if (userDb.role === 'EMPLOYEE') {
        router.navigate(['/employee/dashboard']); // <-- Fixed!
      } else {
        router.navigate(['/dashboard']);
      }
      
      return false;
    }),
    catchError((err) => {
      console.error("Role Guard Error:", err);
      router.navigate(['/login']);
      return of(false);
    })
  );
};