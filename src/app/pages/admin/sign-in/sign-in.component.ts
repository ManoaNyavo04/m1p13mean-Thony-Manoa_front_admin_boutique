import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '../../../shared/components/auth/signin-form/signin-form.component';
import { UtilisateursService } from '../../../shared/services/utilisateur/utilisateurs.service';

@Component({
  selector: 'app-sign-in',
  imports: [
    AuthPageLayoutComponent,
    SigninFormComponent,
  ],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export class SignInComponent {

  errorMessage = '';

  constructor(
    private utilisateursService: UtilisateursService,
    private router: Router
  ) {}

  onLogin(credentials: { email: string; password: string }) {
    this.errorMessage = '';
    this.utilisateursService.loginAdmin(credentials.email, credentials.password).subscribe({
      next: (response) => {
        this.utilisateursService.setToken(response.token);
        this.router.navigate(['/ecommerce']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Échec de la connexion. Veuillez réessayer.';
      }
    });
  }
}
