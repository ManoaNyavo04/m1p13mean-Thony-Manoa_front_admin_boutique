import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';

@Component({
  selector: 'app-categorie-modal',
  imports: [
    ModalComponent,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent
  ],
  templateUrl: './categorie-modal.component.html',
  styles: ``
})
export class CategorieModalComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() categorieForm: any = { categorie: '' };
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  onClose() {
    this.close.emit();// Émet l'événement "close"
  }

  onSave() {
    this.save.emit(this.categorieForm);// Émet "save" avec les données
  }
}
