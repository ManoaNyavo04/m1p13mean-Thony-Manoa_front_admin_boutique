import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CheckboxComponent } from '../../shared/components/form/input/checkbox.component';
import { ProduitService } from '../../shared/services/produit/produit.service';

@Component({
  selector: 'app-produit',
  imports: [
    ButtonComponent,
    CheckboxComponent,
  ],
  templateUrl: './produit.component.html',
  styles: ``
})
export class ProduitComponent implements OnInit {
    produits: any[] = [];
    constructor(private produitService: ProduitService) {}

    ngOnInit() {
        this.loadProduits();
    }

    loadProduits() {
        this.produitService.getMesProduits().subscribe({
        next: (data) => {
            this.produits = data;
            console.log('Catégories chargées:', this.produits);
        },
        error: (error) => {
            console.error('Erreur lors du chargement des produits:', error);
        }
    });
  }

}