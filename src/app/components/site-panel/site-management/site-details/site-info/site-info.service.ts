import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ISite } from '@sites/site-management';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

@Injectable()
export class SiteInfoService {
  private baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.SITES}/`;

  constructor(private http: HttpClient) { }

  create(data: ISite): Observable<ISite> {
    return this.http.post<ISite>(`${this.baseUrl}`, data);
  }

  update(id: number, data: ISite): Observable<ISite> {
    return this.http.patch<ISite>(`${this.baseUrl}${id}`, data);
  }
}
