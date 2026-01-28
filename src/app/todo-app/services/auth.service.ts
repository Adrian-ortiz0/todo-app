import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:7237/api/auth';

  constructor() {
    const token = this.getToken();
    if (!token) {
      this.currentUser.set(null);
    }
  }

  public currentUser = signal<string | null>(localStorage.getItem('username'));
  isLoggedIn = computed(() => !!this.currentUser());

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
        email,
        password,
      }),
    );

    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);
    this.currentUser.set(response.username);

    this.router.navigate(['/tasks']);
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
        username,
        email,
        password,
      }),
    );

    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);

    this.currentUser.set(response.username);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
