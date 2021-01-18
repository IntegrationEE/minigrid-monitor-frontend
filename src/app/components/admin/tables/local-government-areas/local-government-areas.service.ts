import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { ILGA } from './local-government-areas.interface';

@Injectable()
export class LocalGovernmentAreaManageService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.LGA}/`;
  constructor(private http: HttpClient) { }

  getAll(): Observable<ILGA[]> {
    return this.http.get<ILGA[]>(this.baseUrl);
  }

  get(id: number): Observable<ILGA> {
    return this.http.get<ILGA>(`${this.baseUrl}${id}`);
  }

  create(data: ILGA): Observable<ILGA> {
    return this.http.post<ILGA>(`${this.baseUrl}`, data);
  }

  update(id: number, data: ILGA): Observable<ILGA> {
    return this.http.patch<ILGA>(`${this.baseUrl}${id}`, data);
  }

  delete(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete<HttpResponse<unknown>>(`${this.baseUrl}${id}`);
  }
}
