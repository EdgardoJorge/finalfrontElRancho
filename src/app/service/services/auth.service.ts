import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdministradorLoginRequest } from '../models/AuthModel';
import { environment } from '../../../enviroments/enviroments.development';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {
  private apiUrl = `${environment.backendBaseUrl}/api/admin/auth`;

  constructor(private http: HttpClient) {}

  login(request: AdministradorLoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, request);
  }
}
