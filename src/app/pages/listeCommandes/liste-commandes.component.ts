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
  ETAT = COMMANDE.ETAT;

  constructor(private commandesService: CommandesService) {}

  ngOnInit(): void {
    this.commandesService.getCommandes().subscribe({
      next: (response) => {
        console.log('Commandes:', response);
        this.commandes = response;
      },
      error: (error) => {
        console.error('Error fetching commandes:', error);
      }
    });
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
        this.ngOnInit();
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
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Erreur annulation commande:', error);
      }
    });
  }
}
