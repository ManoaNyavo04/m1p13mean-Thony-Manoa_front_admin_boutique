import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  type: string | number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';

  setToken(token: string): void {
    console.log('Setting token:', token);
    localStorage.setItem(this.TOKEN_KEY, token);
    const decoded = this.decodeToken(token);
    console.log('Decoded token:', decoded);
    if (decoded) {
      const userType = this.mapTypeToRole(decoded.type);
      localStorage.setItem(this.USER_KEY, JSON.stringify({
        userId: decoded.userId,
        type: userType
      }));
      console.log('User info stored:', { userId: decoded.userId, type: userType });
    } else {
      console.error('Failed to decode token');
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserInfo(): { userId: string; type: string } | null {
    const userInfo = localStorage.getItem(this.USER_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  getUserRole(): string | null {
    const userInfo = this.getUserInfo();
    console.log('getUserRole called, userInfo:', userInfo);
    return userInfo?.type || null;
  }

  getUserName(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo?.userId || null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const decoded = this.decodeToken(token);
    if (!decoded) return false;
    
    return decoded.exp * 1000 > Date.now();
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isBoutique(): boolean {
    return this.getUserRole() === 'BOUTIQUE';
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('JWT decoded successfully:', decoded);
      return decoded;
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  }

  private mapTypeToRole(type: string | number): string {
    if (typeof type === 'number') {
      switch(type) {
        case 0: return 'ADMIN';
        case 1: return 'ACHETEUR';
        case 2: return 'BOUTIQUE';
        default: return 'UNKNOWN';
      }
    }
    return type;
  }
}
