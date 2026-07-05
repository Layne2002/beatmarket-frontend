import { Usuario } from '../../shared/interfaces/Usuario.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environments.url_api;
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

register(usuario: Usuario) {
  return this.http.post<Usuario>(`${this.baseUrl}/auth/register`, usuario);
}
  private loadUserFromToken() {
    const decoded = this.decodeToken();
    if (decoded) {
      const usuario: Usuario = {
        id: decoded.id,
        email: decoded.sub,
        nombre: decoded.nombre,
        apellidos: decoded.apellidos,
        contraseña: '', 
        rol: decoded.rol
      };
      this.userSubject.next(usuario);
    }
  }

  get currentUser(): Usuario | null {
    return this.userSubject.value;
  }
  private decodeToken(): any | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
}

  getUserIdFromToken(): number | null {
    const decoded = this.decodeToken();
    return decoded?.id || null;
  }

  getUserRoleFromToken(): number | null {
    const decoded = this.decodeToken();
    return decoded?.rol || null;
  }

  login(email: string, password: string): Observable<Usuario | undefined> {
    const body = { email, password };

    return this.http.post<{ token: string, usuario: Usuario }>(`${this.baseUrl}/auth/login`, body).pipe(
      tap(({ token, usuario }) => {
        localStorage.setItem('token', token);
        this.userSubject.next(usuario);
      }),
      map(response => response.usuario),
      catchError(() => of(undefined))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
}
