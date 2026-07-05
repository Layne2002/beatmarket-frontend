import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environments } from "src/environments/environments";
import { AuthService } from "src/app/auth/services/auth.service";
import { CarritoItem, Carrito } from "../interfaces/carritoItem.interface";

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private baseUrl = environments.url_api;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCarrito(): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.baseUrl}/carrito/mi-carrito`);
  }

  anyadirItem(item: CarritoItem): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.baseUrl}/carrito`, item);
  }

  quitarItem(id: string): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.baseUrl}/carrito/producto/${id}`);
  }

  clearCarrito(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/carrito/vaciar`);
  }

  actualizarCantidad(productoId: string, cantidad: number): Observable<Carrito> {
    console.log({ cantidad });
    return this.http.put<Carrito>(`${this.baseUrl}/carrito/producto/${productoId}`, cantidad);
  }
}