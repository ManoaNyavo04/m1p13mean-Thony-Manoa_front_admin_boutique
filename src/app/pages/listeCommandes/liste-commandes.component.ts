import { Component, OnInit } from '@angular/core';
import { CommandesService } from '../../shared/services/commandes/commandes.service';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import {COMMANDE} from '../../shared/constant/commandes.constant';
import { NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-liste-commandes',
  imports: [NgClass, DatePipe],
  templateUrl: './liste-commandes.component.html',
  styles: ``
})
export class ListeCommandesComponent implements OnInit {

  commandes: any[] = [];
  selectedCommande: any = null;
  showDetails = false;
  ETAT = COMMANDE.ETAT;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 0;
  totalItems = 0;

  constructor(private commandesService: CommandesService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.commandesService.getCommandes(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        console.log('Commandes:', response);
        this.commandes = response.data || response;
        this.totalItems = response.totalPages || this.commandes.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      },
      error: (error) => {
        console.error('Error fetching commandes:', error);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCommandes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCommandes();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCommandes();
    }
  }

  getEtatString(etat: number): string {
    switch(etat) {
      case this.ETAT.PAYER:
        return 'Payé';
      case this.ETAT.ANNULE:
        return 'Annulé';
      case this.ETAT.A_VALIDER:
        return 'À valider';
      default:
        return '';
    }
  }

  getEtatClass(etat: number): string {
    switch(etat) {
      case this.ETAT.PAYER:
        return 'px-3 py-1 text-sm text-white bg-green-500 rounded';
      case this.ETAT.ANNULE:
        return 'px-3 py-1 text-sm text-white bg-red-500 rounded';
      case this.ETAT.A_VALIDER:
        return 'px-3 py-1 text-sm text-white bg-yellow-500 rounded';
      default:
        return '';
    }
  }

  validerCommande(commandeId: number): void {
    this.commandesService.validateCommande(commandeId).subscribe({
      next: (response) => {
        console.log('Commande validée:', response);
        this.loadCommandes();
      },
      error: (error) => {
        console.error('Erreur validation commande:', error);
      }
    });
  }

  annulerCommande(commandeId: number): void {
    this.commandesService.cancelCommande(commandeId).subscribe({
      next: (response) => {
        console.log('Commande annulée:', response);
        this.loadCommandes();
      },
      error: (error) => {
        console.error('Erreur annulation commande:', error);
      }
    });
  }

  showCommandeDetails(commandeId: string): void {
    this.commandesService.getCommandeById(commandeId).subscribe({
      next: (response) => {
        this.selectedCommande = response;
        this.showDetails = true;
      },
      error: (error) => {
        console.error('Erreur récupération détails:', error);
      }
    });
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedCommande = null;
  }
}
