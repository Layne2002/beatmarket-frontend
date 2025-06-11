import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../shared/interfaces/Role.interface';
import { environments } from 'src/environments/environments';


@Injectable({
  providedIn: 'root',
})
export class RolesService {
  roles?: Role[];

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environments.url_api}/roles`);
  }

}
