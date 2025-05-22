import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Cliente } from '../models/ClienteModel';
import { environment } from '../../../enviroments/enviroments.development';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.backendBaseUrl}/api/Cliente`;
  private imgbbApiKey = '145312d251ae2bcd0d341205715d14a4';

  constructor(private http: HttpClient) {}

  crearCliente(Cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, Cliente);
  }

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  actualizarCliente(id: number, Cliente: Cliente): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, Cliente);
  }

  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarClientes(criterio: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar`, {
      params: { criterio }
    });
  }

}
