import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';

@Component({
  selector: 'app-produit-modal',
  imports: [
    ModalComponent,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent,
    FormsModule
  ],
  templateUrl: './produit-modal.component.html',
  styles: ``
})
export class ProduitModalComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() produitForm: any = { nomProduit: '', prix :'', nombre :'', categorie: '', image: null };
  @Input() categories: any[] = [];
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  selectedFileName: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.produitForm.image = file;
      this.selectedFileName = file.name;
    }
  }

  onClose() {
    this.close.emit();// Émet l'événement "close"
  }

  onSave() {
    this.save.emit(this.produitForm);// Émet "save" avec les données
  }
}
