import { Component, EventEmitter, Output, Input } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    FormsModule
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  @Output() loginSubmit = new EventEmitter<{ email: string; password: string }>();
  @Input() errorMessage = '';
  @Input() loginTitle = 'Sign In';

  showPassword = false;

  email = '';
  password = '';

  updateEmail(value: string | number) {
    this.email = String(value);
  }

  updatePassword(value: string | number) {
    this.password = String(value);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.loginSubmit.emit({ email: this.email, password: this.password });
  }
}
