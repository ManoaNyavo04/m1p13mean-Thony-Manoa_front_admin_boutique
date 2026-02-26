import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ModalComponent } from "../../shared/components/ui/modal/modal.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-restock-modal',
    imports: [
        ModalComponent,
        LabelComponent,
        InputFieldComponent,
        FormsModule,
        CommonModule
    ],
    templateUrl: './restock-modal.component.html',
    styles: ``
})
export class RestockModalComponent {
    @Input() isOpen = false;
    @Input() isEditMode = false;
    @Input() restockForm: any = { produit: '', prix: '', nombre: ''};
    @Input() produits: any[] = [];

    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<any>();

    searchTerm: string = '';
    filteredProduits: any[] = [];
    showDropdown: boolean = false;
    selectedProduitName: string = '';

    ngOnChanges() {
        this.filteredProduits = this.produits;
    }

    onSearchChange() {
        const search = this.searchTerm.toLowerCase();
        this.filteredProduits = this.produits.filter(p => 
            p.nomProduit.toLowerCase().includes(search)
        );
        this.showDropdown = this.searchTerm.length > 0;
    }

    selectProduit(produit: any) {
        this.restockForm.produit = produit._id;
        this.selectedProduitName = produit.nomProduit;
        this.searchTerm = produit.nomProduit;
        this.showDropdown = false;
    }

    onClose() {
        this.close.emit();
        this.searchTerm = '';
        this.selectedProduitName = '';
        this.showDropdown = false;
    }

    onSave() {
        this.save.emit(this.restockForm);
    }
}