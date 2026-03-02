import { Component, OnInit } from "@angular/core";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { CheckboxComponent } from "../../shared/components/form/input/checkbox.component";
import { ProduitModalComponent } from "../produit/produit-modal.component";
import { FormsModule } from "@angular/forms";
import { AcheteurService } from "../../shared/services/acheteur/acheteur.service";

@Component({
    selector: 'app-acheteur',
    imports: [
        FormsModule
    ],
    templateUrl: './acheteur.component.html',
    styles: ``
})
export class AcheteurComponent implements OnInit {
    acheteurs: any[] = [];

    // Pagination
    filteredAcheteur: any[] = [];
    paginatedAcheteur: any[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;

    // Recherche
    searchTerm: string = '';

    constructor(
        private acheteurService: AcheteurService
    ) { }

    ngOnInit(): void {
        this.loadListAcheteurs();
    }

    loadListAcheteurs() {
        this.acheteurService.getListeAcheteurs().subscribe({
            next: (data) => {
                this.acheteurs = data;
                this.applyFilters();
                console.log('Acheteurs chargés:', this.acheteurs);
            },
            error: (error) => {
                console.error('Erreur lors du chargement des acheteurs:', error);
            }
        });
    }

    applyFilters() {
        this.filteredAcheteur = this.acheteurs.filter(acht =>
            acht.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.totalPages = Math.ceil(this.filteredAcheteur.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.paginatedAcheteur = this.filteredAcheteur.slice(start, end);
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

}