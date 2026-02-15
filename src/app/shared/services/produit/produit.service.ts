import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
    private apiUrl = environment.apiUrl;
    private readonly TOKEN_KEY = 'auth_token';

    constructor(private http: HttpClient) {}

    getMesProduits(): Observable<any> {
      return this.http.get(`${this.apiUrl}/boutique/mes-produits`);
    }

    createProduit(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/produit/create-produit`, data);
    }

    updateProduit(produit: any): Observable<any> {
      return this.http.put(
        `${this.apiUrl}/produit/modifier-produit/${produit._id}`,
        produit
      );
    }


    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
}