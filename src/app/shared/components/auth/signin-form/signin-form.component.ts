import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    FormsModule,
    RouterModule
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent implements OnInit {

  @Output() loginSubmit = new EventEmitter<{ email: string; password: string }>();
  @Input() errorMessage = '';
  @Input() loginTitle = 'Sign In';
  @Input() type = '';

  showPassword = false;

  email = '';
  password = '';

  ngOnInit(): void {
    if (this.type === 'admin') {
      this.email = 'admin@gmail.com';
      this.password = 'admin123';
    } else if (this.type === 'boutique') {
      this.email = 'boutique@gmail.com';
      this.password = 'boutique123';
    }
  }

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
