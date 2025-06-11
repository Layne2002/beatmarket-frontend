import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../../shared/interfaces/producto.interface';
import { NuevoProducto } from '../interfaces/NuevoProducto.interface';
import { environments } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private baseUrl: string = environments.url_api + '/productos';

  constructor(private http: HttpClient) {}

  getTodosLosProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  getProductoPorTituloYAutor(
    tituloAlbum: string,
    autor: string
  ): Observable<Producto | undefined> {
    const tituloEncoded = encodeURIComponent(tituloAlbum);
    const autorEncoded = encodeURIComponent(autor);
    return this.http.get<Producto | undefined>(
      `${this.baseUrl}/search?tituloAlbum=${tituloEncoded}&autor=${autorEncoded}`
    );
  }

  getProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  crearProducto(producto: NuevoProducto): Observable<NuevoProducto> {
    return this.http.post<NuevoProducto>(this.baseUrl, producto);
  }

  actualizarProducto(id: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto);
  }

  borrarProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getSuggestions(query: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/search?query=${query}`);
  }

  getAlbumSuggestions(query: string): Observable<any[]> {
    const apiKey = environments.apiKey;
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(
      query
    )}&api_key=${apiKey}&format=json`;

    return this.http
      .get<any>(url)
      .pipe(map((res) => res?.results?.albummatches?.album || []));
  }

  buscarPorTituloYAutor(
    tituloAlbum: string,
    autor: string
  ): Observable<Producto[]> {
    const url = `${this.baseUrl}/search?tituloAlbum=${tituloAlbum}&autor=${autor}`;
    return this.http.get<Producto[]>(url);
  }

  crearOActualizarProducto(
    nuevoProducto: NuevoProducto
  ): Observable<NuevoProducto> {
    return this.http.post<NuevoProducto>(
      `${this.baseUrl}/crear-o-actualizar`,
      nuevoProducto
    );
  }
}
