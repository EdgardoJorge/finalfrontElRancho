import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroments.development';
import { Observable } from 'rxjs';
import { Administrador } from '../models/AdminModel';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  private apiUrl = `${environment.backendBaseUrl}/api/administradores`;

  constructor(private http: HttpClient) {}

  getAdministradorById(id: number): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.apiUrl}/${id}`);
  }
}
