import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
    private apiUrl = environment.apiUrl;
    private readonly TOKEN_KEY = 'auth_token';

    constructor(private http: HttpClient) {}

    getAllCategories(): Observable<any> {
      return this.http.get(`${this.apiUrl}/categorieProduit`);
    }

    createCategorie(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/categorieProduit/create-categorie`, data);
    }

    updateCategorie(categorie: any): Observable<any> {
      return this.http.put(
        `${this.apiUrl}/categorieProduit/update-categorie/${categorie._id}`,
        categorie
      );
    }


    deleteCategorie(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/categorieProduit/delete-categorie/${id}`);
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