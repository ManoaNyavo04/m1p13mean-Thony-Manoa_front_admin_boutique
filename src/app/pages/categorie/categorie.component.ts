import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../shared/services/categorie/categorie.service';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CheckboxComponent } from '../../shared/components/form/input/checkbox.component';
import { CategorieModalComponent } from './categorie-modal.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-categorie',
  imports: [
    ButtonComponent,
    CheckboxComponent,
    CategorieModalComponent,
    FormsModule
  ],
  templateUrl: './list-categorie.component.html',
  styles: ``
})
export class CategorieComponent implements OnInit {
  categories: any[] = [];
  filteredCategories: any[] = [];
  paginatedCategories: any[] = [];
  
  isModalOpen = false;
  isEditMode = false;
  selectedCategorie: any = null;
  
  categorieForm = {
    categorie: '',
  };

  selectedRows: string[] = [];
  selectAll: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  
  // Recherche
  searchTerm: string = '';

  constructor(
    private categorieService: CategorieService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.applyFilters();
        console.log('Catégories chargées:', this.categories);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.snackbarService.error('Erreur lors du chargement des catégories');
      }
    });
  }

  applyFilters() {
    this.filteredCategories = this.categories.filter(cat =>
      cat.categorie.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCategories = this.filteredCategories.slice(start, end);
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
    this.categorieForm = { categorie: '' };
    this.isModalOpen = true;
  }

  openEditModal(categorie: any) {
     console.log(categorie); 
    this.isEditMode = true;
    this.categorieForm = { ...categorie }; // Copie les données dans le formulaire
    this.selectedCategorie = { ...categorie }; // Garde une copie de la catégorie
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.categorieForm = { categorie: ''};
  }

  saveCategorie(formData: any) {
    console.log('=== DEBUT saveCategorie ===');
    console.log('Données reçues:', formData);
    console.log('isEditMode:', this.isEditMode);
    
    if (!formData.categorie || formData.categorie.trim() === '') {
      console.error('Le champ catégorie est vide');
      this.snackbarService.error('Le champ catégorie est vide');
      return;
    }
    
    if (this.isEditMode) {
      console.log('Mode EDITION');
      this.categorieService.updateCategorie(formData).subscribe({
        next: () => {
          console.log('SUCCESS - Modification');
          this.snackbarService.success('Catégorie modifiée avec succès');
          this.loadCategories();
          this.closeModal();
        },
        error: (error) => {
          console.error('ERROR - Modification:', error);
          this.snackbarService.error('Erreur lors de la modification');
        }
      });
    } else {
      console.log('Mode CREATION');
      this.categorieService.createCategorie(formData).subscribe({
        next: () => {
          console.log('SUCCESS - Création');
          this.snackbarService.success('Catégorie créée avec succès');
          this.loadCategories();
          this.closeModal();
        },
        error: (error) => {
          console.error('ERROR - Création:', error);
          this.snackbarService.error('Erreur lors de la création');
        }
      });
    }
  }

  deleteCategorie(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categorieService.deleteCategorie(id).subscribe({
        next: () => {
          this.snackbarService.success('Catégorie supprimée avec succès');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.snackbarService.error('Erreur lors de la suppression');
        }
      });
    }
  }

  handleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedRows = this.categories.map(cat => cat.id);
    } else {
      this.selectedRows = [];
    }
  }

  handleRowSelect(id: string) {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
  }
}
