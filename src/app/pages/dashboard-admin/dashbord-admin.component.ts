import { Component, OnInit } from '@angular/core';
import { DashboardBoutiqueService } from '../../shared/services/dashboard/dashboard.boutique.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styles: ``
})
export class DashboardAdminComponent implements OnInit {
  // Filtres
  dateDebut: string = '';
  dateFin: string = '';

  // Stats
  totalCommandes: number = 0;
  totalBoutiques: number = 0;
  totalAcheteurs: number = 0;
  venteParBoutique: any[] = [];

  constructor(private dashboardService: DashboardBoutiqueService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    let url = '';
    if (this.dateDebut && this.dateFin) {
      url = `?dateDebut=${this.dateDebut}&dateFin=${this.dateFin}`;
    }

    this.dashboardService.getDashboardAdmin(url).subscribe({
      next: (data) => {
        this.totalCommandes = data.totalCommandes || 0;
        this.totalBoutiques = data.totalBoutiques || 0;
        this.totalAcheteurs = data.totalAcheteurs || 0;
        this.venteParBoutique = data.venteParBoutique || [];
      },
      error: (error) => {
        console.error('Erreur chargement dashboard:', error);
      }
    });
  }

  onFilterChange() {
    this.loadDashboard();
  }

  getBarHeight(value: number): number {
    const max = Math.max(...this.venteParBoutique.map(d => d.chiffreAffaires));
    return max > 0 ? (value / max) * 100 : 0;
  }
}
