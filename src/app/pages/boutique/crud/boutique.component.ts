import { Component, OnInit } from '@angular/core';

import { BoutiqueService } from '../../../shared/services/boutique/boutique.service';
import { UTILISATEUR } from '../../../shared/constant/utilisateurs.constant';
import { NgClass, DatePipe } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-boutique',
  imports: [NgClass, DatePipe],
  templateUrl: './boutique.component.html',
  styles: ``
})
export class BoutiqueComponent implements OnInit {
  boutiques: any[] = []; 
  ETAT_BOUTIQUE = UTILISATEUR.ETAT;

  selectedRows: string[] = []; 
  selectAll: boolean = false; 

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
        console.log('boutique chargées:', this.boutiques);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des boutiques:', error);
        this.snackbarService.error('Erreur lors du chargement des boutiques');
      }
    });
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
