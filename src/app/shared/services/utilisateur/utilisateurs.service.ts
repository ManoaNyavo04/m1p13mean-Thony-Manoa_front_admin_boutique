import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilisateursService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  loginAdmin(mail: string, mdp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, { mail, mdp });
  }

  loginBoutique(mail: string, mdp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/boutique/login`, { mail, mdp });
  }

  registerBoutique(nom: string, mail: string, contact: string, mdp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/boutique/register`, { nom, mail, contact, mdp });
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

  setUserInfo(nom: string, mail: string): void {
    const existingInfo = this.getUserInfo();
    const userInfo = existingInfo ? { ...existingInfo, nom, mail } : { nom, mail };
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  }

  getUserInfo(): { nom: string; mail: string } | null {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }
}
