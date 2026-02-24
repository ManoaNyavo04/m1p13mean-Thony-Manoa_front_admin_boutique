import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommandesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCommandes(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/commande/?page=${page}&limit=${limit}`);
  }

  getCommandeById(commandeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/commande/${commandeId}`);
  }

  validateCommande(commandeId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/commande/validate/${commandeId}`, {});
  }

  cancelCommande(commandeId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/commande/cancel/${commandeId}`, {});
  }
}
