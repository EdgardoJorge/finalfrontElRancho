import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../models/BannerModel';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiurl = `${environment}/api/Banner`;
  private imgbbApiKey = '145312d251ae2bcd0d341205715d14a4';
  constructor(private http : HttpClient ) { }

  getall(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiurl);
  }
}
