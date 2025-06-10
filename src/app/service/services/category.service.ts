// category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Categoria } from '../models/CategoryModel';
import { environment } from '../../../enviroments/enviroments.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.backendBaseUrl}/api/Categoria`;
  private imgbbApiKey = '145312d251ae2bcd0d341205715d14a4';

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  subirImagen(file: File): Observable<any> {
    return from(this.convertirABase64(file)).pipe(
      switchMap(base64 => {
        const formData = new FormData();
        formData.append('key', this.imgbbApiKey);
        formData.append('image', base64);
        return this.http.post('https://api.imgbb.com/1/upload', formData);
      })
    );
  }

  private convertirABase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
