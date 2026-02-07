
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  @Output() loginSubmit = new EventEmitter<{ email: string; password: string }>();
  @Input() errorMessage = '';

  showPassword = false;
  isChecked = false;

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
