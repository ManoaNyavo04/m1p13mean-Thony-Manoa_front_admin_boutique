import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class BoutiqueService {
    private apiUrl = environment.apiUrl;
    private readonly TOKEN_KEY = 'auth_token';

    constructor(private http: HttpClient) {}

    getListeBoutique(): Observable<any> {
      return this.http.get(`${this.apiUrl}/boutique/liste-boutique`);
    }

    validateBoutique(boutiqueId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/boutique/validate/${boutiqueId}`, {});
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