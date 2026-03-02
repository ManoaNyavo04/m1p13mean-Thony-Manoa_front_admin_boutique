import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SignupFormComponent } from '../../../shared/components/auth/signup-form/signup-form.component';
import { UtilisateursService } from '../../../shared/services/utilisateur/utilisateurs.service';

@Component({
  selector: 'app-sign-up',
  imports: [
    AuthPageLayoutComponent,
    SignupFormComponent,
  ],
  templateUrl: './sign-up.component.html',
  styles: ``
})
export class SignUpComponent {

  errorMessage = '';

  constructor(
    private utilisateursService: UtilisateursService,
    private router: Router
  ) {}

  onRegister(data: { nom: string; mail: string; numero: string; mdp: string }) {
    this.errorMessage = '';
    this.utilisateursService.registerBoutique(data.nom, data.mail, data.numero, data.mdp).subscribe({
      next: (response) => {
        console.log('Registration success:', response);
        this.router.navigate(['/boutique/login']);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Une erreur est survenue';
        console.error('Registration failed:', error);
      }
    });
  }
}
