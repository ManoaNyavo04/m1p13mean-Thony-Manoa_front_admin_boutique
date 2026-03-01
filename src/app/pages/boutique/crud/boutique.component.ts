import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoutiqueService } from '../../../shared/services/boutique/boutique.service';
import { UTILISATEUR } from '../../../shared/constant/utilisateurs.constant';
import { NgClass, DatePipe } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-boutique',
  imports: [NgClass, DatePipe, FormsModule],
  templateUrl: './boutique.component.html',
  styles: ``
})
export class BoutiqueComponent implements OnInit {
  boutiques: any[] = []; 
  ETAT_BOUTIQUE = UTILISATEUR.ETAT;

  selectedRows: string[] = []; 
  selectAll: boolean = false;

  // Pagination
  filteredBoutiques: any[] = [];
  paginatedBoutiques: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  
  // Recherche
  searchTerm: string = ''; 

  constructor(
    private boutiqueService: BoutiqueService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.getBoutique();
  }

  getBoutique() {
    this.boutiqueService.getListeBoutique().subscribe({
      next: (data) => {
        this.boutiques = data;
        this.applyFilters();
        console.log('boutique chargées:', this.boutiques);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des boutiques:', error);
        this.snackbarService.error('Erreur lors du chargement des boutiques');
      }
    });
  }

  applyFilters() {
    this.filteredBoutiques = this.boutiques.filter(boutique =>
      boutique.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      boutique.mail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      boutique.contact.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredBoutiques.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedBoutiques = this.filteredBoutiques.slice(start, end);
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

  getEtatString(etat: number): string {
    switch(etat) {
      case this.ETAT_BOUTIQUE.ACTIF:
        return 'Actif';
      case this.ETAT_BOUTIQUE.A_VALIDER:
        return 'À valider';
      default:
        return '';
    }
  }

  getEtatClass(etat: number): string {
    switch(etat) {
      case this.ETAT_BOUTIQUE.ACTIF:
        return 'px-3 py-1 text-sm text-white bg-green-500 rounded';
      case this.ETAT_BOUTIQUE.A_VALIDER:
        return 'px-3 py-1 text-sm text-white bg-yellow-500 rounded';
      default:
        return '';
    }
  }

  validerBoutique(boutiqueId: number): void {
    this.boutiqueService.validateBoutique(boutiqueId).subscribe({
      next: (response) => {
        console.log('boutique validée:', response);
        this.snackbarService.success('Boutique validée avec succès');
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Erreur validation boutique:', error);
        this.snackbarService.error('Erreur lors de la validation de la boutique');
      }
    });
  }

  

  handleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedRows = this.boutiques.map(boutik => boutik.id);
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
