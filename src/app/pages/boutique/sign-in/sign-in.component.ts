import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '../../../shared/components/auth/signin-form/signin-form.component';
import { UtilisateursService } from '../../../shared/services/utilisateur/utilisateurs.service';
import { AuthService } from '../../../shared/services/auth/auth.service';

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
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(credentials: { email: string; password: string }) {
    this.errorMessage = '';
    console.log('Boutique login attempt:', credentials.email);
    this.utilisateursService.loginBoutique(credentials.email, credentials.password).subscribe({
      next: (response) => {
        console.log('Boutique login response:', response);
        this.authService.setToken(response.token);
        this.router.navigate(['/boutique/produit']);
      },
      error: (error) => {
        console.error('Boutique login error:', error);
        this.errorMessage = error.error?.message || 'Échec de la connexion. Veuillez réessayer.';
      }
    });
  }
}
