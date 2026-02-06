import { Component } from '@angular/core';
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

  constructor(private utilisateursService: UtilisateursService) {}

  onLogin(credentials: { email: string; password: string }) {
    this.utilisateursService.login(credentials.email, credentials.password).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        // Handle successful login
      },
      error: (error) => {
        console.error('Login failed:', error);
        // Handle login error
      }
    });
  }
}
