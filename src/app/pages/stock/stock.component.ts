import { Component, OnInit } from "@angular/core";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { FormsModule } from "@angular/forms";
import { NgClass, DatePipe } from "@angular/common";
import { ProduitService } from "../../shared/services/produit/produit.service";
import { STOCK } from "../../shared/constant/stocks.constant";
import { SnackbarService } from "../../services/snackbar.service";
import { RestockModalComponent } from "./restock-modal.component";
import { environment } from "../../environments/environment";

@Component({
    selector: 'app-produit',
    imports: [
        RestockModalComponent,
        FormsModule,
        NgClass,
        DatePipe
    ],
    templateUrl: './stock.component.html',
    styles: ``
})
export class StockComponent implements OnInit {
    private apiUrl = environment.apiUrl;
    stocks: any[] = [];
    ETAT_STOCK = STOCK.ETAT;
    isModalOpen = false;
    isEditMode = false;
    selectedProduit: any = null;

    restockForm = { produit: '', prix: '', nombre: '' };

    // Pagination
    filteredStock: any[] = [];
    paginatedStock: any[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;

    // Recherche
    searchTerm: string = '';
    dateDebut: string = '';
    dateFin: string = '';

    // Statistiques
    totalVentes: number = 0;
    totalAjouts: number = 0;
    produits: any[] = [];

    constructor(
        private produitService: ProduitService,
        private snackbarService: SnackbarService
    ) { }

    ngOnInit(): void {
        this.getMvtStock();
        this.getProduits();
    }

    getMvtStock() {
        this.produitService.getMvtStock().subscribe({
            next: (data) => {
                this.stocks = data;
                this.applyFilters();
                console.log('Mouvements de stock chargés:', this.stocks);
            },
            error: (error) => {
                console.error('Erreur lors du chargement des mouvements de stock:', error);
            }
        });
    }

    getProduits() {
        this.produitService.getMesProduits().subscribe({
            next: (data) => {
                this.produits = data;
                console.log('Produits chargés:', this.produits);
            },
            error: (error) => {
                console.error('Erreur lors du chargement des produits:', error);
            }
        });
    }

    applyFilters() {
        this.filteredStock = this.stocks.filter(stock => {
            const searchLower = this.searchTerm.toLowerCase();
            const matchSearch = stock.produit.nomProduit.toLowerCase().includes(searchLower) ||
                stock.produit.prix.toString().includes(searchLower) ||
                stock.prix.toString().includes(searchLower) ||
                stock.nombre.toString().includes(searchLower);

            // Filtre par date
            let matchDate = true;
            if (this.dateDebut || this.dateFin) {
                const stockDate = new Date(stock.date);
                if (this.dateDebut) {
                    const debut = new Date(this.dateDebut);
                    matchDate = matchDate && stockDate >= debut;
                }
                if (this.dateFin) {
                    const fin = new Date(this.dateFin);
                    fin.setHours(23, 59, 59, 999);
                    matchDate = matchDate && stockDate <= fin;
                }
            }

            return matchSearch && matchDate;
        });

        // Calculer les statistiques
        this.totalVentes = this.filteredStock
            .filter(s => s.etat === this.ETAT_STOCK.VENTE)
            .reduce((sum, s) => sum + s.nombre, 0);

        this.totalAjouts = this.filteredStock
            .filter(s => s.etat === this.ETAT_STOCK.AJOUT)
            .reduce((sum, s) => sum + s.nombre, 0);

        this.totalPages = Math.ceil(this.filteredStock.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.paginatedStock = this.filteredStock.slice(start, end);
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
        switch (etat) {
            case this.ETAT_STOCK.AJOUT:
                return 'Ajout';
            case this.ETAT_STOCK.VENTE:
                return 'Vente';
            default:
                return '';
        }
    }

    getEtatClass(etat: number): string {
        switch (etat) {
            case this.ETAT_STOCK.AJOUT:
                return 'px-3 py-1 text-sm text-white bg-green-500 rounded';
            case this.ETAT_STOCK.VENTE:
                return 'px-3 py-1 text-sm text-white bg-yellow-500 rounded';
            default:
                return '';
        }
    }

    getImageUrl(imagePath: string | null): string {
        if (!imagePath) return '/images/default-product.png';
        return `${this.apiUrl}/${imagePath}`;
    }

    getBarHeight(value: number): number {
        const max = Math.max(this.totalAjouts, this.totalVentes);
        return max > 0 ? (value / max) * 100 : 0;
    }

    openCreateModal() {
        this.isEditMode = false;
        this.restockForm = { produit: '', prix: '', nombre: '' };
        this.isModalOpen = true;
    }


    closeModal() {
        this.isModalOpen = false;
        this.restockForm = { produit: '', prix: '', nombre: '' };
    }

    restockProduit(formData: any) {
        console.log('=== DEBUT restockProduit ===');
        console.log('Données reçues:', formData);

        // Validation
        if (!formData.produit || !formData.nombre || !formData.prix) {
            this.snackbarService.error('Tous les champs sont requis');
            return;
        }

        const dataToSend: any = {
            produit: formData.produit,
            prix: parseInt(formData.prix),
            nombre: parseInt(formData.nombre)
        };

        console.log('Données à envoyer:', dataToSend);

        this.produitService.restockProduit(dataToSend).subscribe({
            next: () => {
                console.log('SUCCESS - Restock');
                this.snackbarService.success('Restock de produit effectué avec succès');
                this.getMvtStock();
                this.closeModal();
            },
            error: (error) => {
                console.error('ERROR - Restock:', error);
                const errorMsg = error.error?.error || error.error?.message || 'Erreur inconnue';
                this.snackbarService.error('Erreur: ' + errorMsg);
            }
        });
    }

}