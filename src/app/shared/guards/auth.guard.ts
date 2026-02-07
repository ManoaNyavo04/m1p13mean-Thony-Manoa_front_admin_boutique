import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilisateursService } from '../services/utilisateur/utilisateurs.service';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const utilisateursService = inject(UtilisateursService);
  const router = inject(Router);
  const token = utilisateursService.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};

export const authBoutiqueGuard: CanActivateFn = (route, state) => {
  const utilisateursService = inject(UtilisateursService);
  const router = inject(Router);
  const token = utilisateursService.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/boutique/login']);
  return false;
};
