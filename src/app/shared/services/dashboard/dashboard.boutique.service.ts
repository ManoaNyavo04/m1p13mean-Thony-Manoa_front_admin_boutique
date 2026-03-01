import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardBoutiqueService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardData(startDate?: string, endDate?: string): Observable<any> {
    let url = `${this.apiUrl}/dashboard/boutique`;
    
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    
    return this.http.get(url);
  }

  getDashboardAdmin(params: string = ''): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/admin${params}`);
  }
}
