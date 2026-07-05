import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deseado } from '../interfaces/deseado.interface';
import { environments } from 'src/environments/environments';



@Injectable({ providedIn: 'root' })
export class DeseadosService {
  private baseUrl = environments.url_api+'/deseados';

  constructor(private http: HttpClient) {}

  addDeseado(deseado: Deseado): Observable<Deseado> {
    return this.http.post<Deseado>(this.baseUrl, deseado);
  }

  getDeseadosByUsuario(): Observable<Deseado[]> {
    return this.http.get<Deseado[]>(`${this.baseUrl}/mis-deseados`);
  }

  getDeseados(): Observable<Deseado[]> {
    return this.http.get<Deseado[]>(this.baseUrl);
  }

  deleteDeseado(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateDeseado(deseado: Partial<Deseado>): Observable<Deseado> {
    return this.http.put<Deseado>(`${this.baseUrl}/${deseado.id}`, deseado);
  }
}