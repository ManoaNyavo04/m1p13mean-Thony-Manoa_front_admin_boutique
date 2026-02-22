import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardBoutiqueService } from '../../shared/services/dashboard/dashboard.boutique.service';

@Component({
  selector: 'app-dashboard-boutique',
  imports: [CommonModule],
  templateUrl: './dashboard-boutique.component.html',
  styles: ``
})
export class DashboardBoutiqueComponent implements OnInit {
  // Nombre de commande total
  nombreInitie = 0;
  nombrePayer = 0;

  // Chiffre d'affaire
  caThisMois = 0;
  caTotal = 0;

  // Meilleur produit
  meilleurProduit = { nom: '', ventes: 0, revenu: 0 };

  // Nombre de vente par produit
  ventesProduits: any[] = [];

  // Dashboard chiffre par mois
  chiffreParMois: any[] = [];
  monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  getMaxMontant(): number {
    if (this.chiffreParMois.length === 0) return 1;
    return Math.max(...this.chiffreParMois.map(d => d.montant));
  }

  getBarHeight(montant: number): number {
    const maxHeight = 200;
    return (montant / this.getMaxMontant()) * maxHeight;
  }

  constructor(private dashboardService: DashboardBoutiqueService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        this.nombrePayer = response.payer;
        this.nombreInitie = response.aValider;
        this.caTotal = response.totalPayer;
        this.caThisMois = response.totalPayerCurrentMonth;
        this.meilleurProduit = {
          nom: response.bestProduct.produitInfo.nomProduit,
          ventes: response.bestProduct.totalNombre,
          revenu: response.bestProduct.totalRevenue
        };
        this.ventesProduits = response.allProductsSales.map((item: any) => ({
          nom: item.produitInfo.nomProduit,
          ventes: item.totalNombre
        }));
        this.chiffreParMois = response.salesByMonth.map((item: any) => ({
          mois: this.monthNames[item._id.month - 1],
          montant: item.totalRevenue
        }));
      },
      error: (error) => {
        console.error('Erreur récupération dashboard:', error);
      }
    });
  }
}
