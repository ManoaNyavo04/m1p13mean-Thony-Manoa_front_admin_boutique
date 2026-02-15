import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../../shared/services/categorie/categorie.service';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CheckboxComponent } from '../../shared/components/form/input/checkbox.component';
import { CategorieModalComponent } from './categorie-modal.component';

@Component({
  selector: 'app-categorie',
  imports: [
    ButtonComponent,
    CheckboxComponent,
    CategorieModalComponent
  ],
  templateUrl: './list-categorie.component.html',
  styles: ``
})
export class CategorieComponent implements OnInit {
  categories: any[] = []; // Liste de toutes les catégories
  isModalOpen = false; // Le modal est-il ouvert ? (oui/non)
  isEditMode = false;// Mode édition ou création ?
  selectedCategorie: any = null;// La catégorie sélectionnée pour édition
  
  categorieForm = { // Le formulaire avec les données
    categorie: '', // Le nom de la catégorie
  };

  selectedRows: string[] = []; // Les lignes sélectionnées (pour sélection multiple)
  selectAll: boolean = false;  // Tout sélectionner ? (oui/non)

  constructor(private categorieService: CategorieService) {}

  ngOnInit() {
    this.loadCategories();
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
    console.log('Données reçues:', formData);
    if (!formData.categorie || formData.categorie.trim() === '') {
      console.error('Le champ catégorie est vide');
      return;
    }
    
    if (this.isEditMode) {
      this.categorieService.updateCategorie(formData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
        }
      });
    } else {
      this.categorieService.createCategorie(formData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }
  }

  deleteCategorie(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categorieService.deleteCategorie(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
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
