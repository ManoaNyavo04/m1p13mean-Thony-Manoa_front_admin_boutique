import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CheckboxComponent } from '../../shared/components/form/input/checkbox.component';
import { ProduitModalComponent } from './produit-modal.component';
import { ProduitService } from '../../shared/services/produit/produit.service';
import { CategorieService } from '../../shared/services/categorie/categorie.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-produit',
  imports: [
    ButtonComponent,
    ProduitModalComponent,
    FormsModule
  ],
  templateUrl: './produit.component.html',
  styles: ``
})
export class ProduitComponent implements OnInit {
  produits: any[] = [];
  categories: any[] = [];

  isModalOpen = false;
  isEditMode = false;
  selectedCategorie: any = null;
  
  produitForm = {
    nomProduit: '', prix :'', nombre :'', categorie: '', image: null as File | null
  };

  selectedRows: string[] = [];
  selectAll: boolean = false;

  // Pagination
  filteredProduit: any[] = [];
  paginatedProduit: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  
  // Recherche
  searchTerm: string = '';

    constructor(
      private produitService: ProduitService,
      private categorieService: CategorieService,
      private snackbarService: SnackbarService
    ) {}

    ngOnInit() {
        this.loadProduits();
        this.loadCategories();
    }

    loadProduits() {
        this.produitService.getMesProduits().subscribe({
        next: (data) => {
            this.produits = data;
            this.applyFilters();
            console.log('Produits chargés:', this.produits);
        },
        error: (error) => {
            console.error('Erreur lors du chargement des produits:', error);
        }
    });
  }

  loadCategories() {
    this.categorieService.getAllCategories().subscribe({
      next: (data) => {
          this.categories = data;
          console.log('Catégories chargées:', this.categories);
      },
      error: (error) => {
          console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  applyFilters() {
    this.filteredProduit = this.produits.filter(prod =>
      prod.nomProduit.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredProduit.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProduit = this.filteredProduit.slice(start, end);
  }

  onSearchChange() {
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openCreateModal() {
    this.isEditMode = false;
    this.produitForm = { nomProduit: '', prix :'', nombre :'', categorie: '', image: null };
    this.isModalOpen = true;
  }

  openEditModal(produit: any) {
     console.log(produit); 
    this.isEditMode = true;
    this.produitForm = { 
      ...produit, 
      categorie: produit.categorie._id,
      image: null
    };
    this.selectedCategorie = { ...produit };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.produitForm = { nomProduit: '', prix :'', nombre :'', categorie: '', image: null};
  }

  ajouterProduit(formData: any) {
    console.log('=== DEBUT ajouterProduit ===');
    console.log('Données reçues:', formData);
    console.log('isEditMode:', this.isEditMode);
    
    // Validation
    if (!formData.nomProduit || !formData.prix || !formData.nombre || !formData.categorie) {
      this.snackbarService.error('Tous les champs sont requis');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('nomProduit', formData.nomProduit);
    formDataToSend.append('prix', formData.prix.toString());
    formDataToSend.append('nombre', formData.nombre.toString());
    formDataToSend.append('categorie', typeof formData.categorie === 'object' ? formData.categorie._id : formData.categorie);
    
    if (formData.image instanceof File) {
      formDataToSend.append('image', formData.image);
    }
    
    if (this.isEditMode) {
      console.log('Mode EDITION');
      this.produitService.updateProduit(formData._id, formDataToSend).subscribe({
        next: () => {
          console.log('SUCCESS - Modification');
          this.snackbarService.success('Produit modifié avec succès');
          this.loadProduits();
          this.closeModal();
        },
        error: (error) => {
          console.error('ERROR - Modification:', error);
          this.snackbarService.error('Erreur lors de la modification');
        }
      });
    } else {
      console.log('Mode CREATION');
      this.produitService.createProduit(formDataToSend).subscribe({
        next: () => {
          console.log('SUCCESS - Création');
          this.snackbarService.success('Produit créé avec succès');
          this.loadProduits();
          this.closeModal();
        },
        error: (error) => {
          console.error('ERROR - Création:', error);
          const errorMsg = error.error?.error || error.error?.message || 'Erreur inconnue';
          this.snackbarService.error('Erreur: ' + errorMsg);
        }
      });
    }
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) return '/images/default-product.png';
    return `http://localhost:3000/${imagePath}`;
  }

}