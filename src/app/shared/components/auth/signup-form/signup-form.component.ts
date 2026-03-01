import { Component, EventEmitter, Output } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-signup-form',
  imports: [
    LabelComponent,
    InputFieldComponent,
    FormsModule
],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {

  showPassword = false;

  @Output() registerSubmit = new EventEmitter<{ nom: string; mail: string; numero: string; mdp: string }>();

  nom = '';
  mail = '';
  numero = '';
  mdp = '';

  updateNom(value: string | number) {
    this.nom = String(value);
  }

  updateMail(value: string | number) {
    this.mail = String(value);
  }

  updateNumero(value: string | number) {
    this.numero = String(value);
  }

  updateMdp(value: string | number) {
    this.mdp = String(value);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.registerSubmit.emit({ nom: this.nom, mail: this.mail, numero: this.numero, mdp: this.mdp });
  }
}
