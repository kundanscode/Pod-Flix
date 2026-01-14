import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'podflix_token';

  constructor(private http: HttpClient) {}

  checkEmail(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/check-email`, { email }).pipe(
      tap((response) => {
        if (response && response.token) {
          this.storeToken(response.token);
        }
      })
    );
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).pipe(
      tap(() => this.clearToken()),
      // Ensure token is cleared even if server fails to respond
      catchError((error) => {
        this.clearToken();
        throw error;
      })
    );
  }

  private clearToken(): void {
    localStorage.clear();
  }
}
