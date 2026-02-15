import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Admin guard check - isAuthenticated:', authService.isAuthenticated(), 'isAdmin:', authService.isAdmin());
  
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  console.log('Admin guard failed, redirecting to login');
  router.navigate(['/admin/login']);
  return false;
};

export const authBoutiqueGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Boutique guard check - isAuthenticated:', authService.isAuthenticated(), 'isBoutique:', authService.isBoutique());

  if (authService.isAuthenticated() && authService.isBoutique()) {
    return true;
  }

  console.log('Boutique guard failed, redirecting to login');
  router.navigate(['/boutique/login']);
  return false;
};
