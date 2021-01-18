import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { IIntegration } from './integrations.interface';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.INTEGRATIONS}/`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IIntegration[]> {
    return this.http.get<IIntegration[]>(this.baseUrl);
  }

  get(id: number): Observable<IIntegration> {
    return this.http.get<IIntegration>(`${this.baseUrl}${id}`);
  }

  create(data: IIntegration): Observable<IIntegration> {
    return this.http.post<IIntegration>(`${this.baseUrl}`, data);
  }

  update(id: number, data: IIntegration): Observable<IIntegration> {
    return this.http.patch<IIntegration>(`${this.baseUrl}${id}`, data);
  }

  restart(id: number): Observable<HttpResponse<unknown>> {
    return this.http.get<HttpResponse<unknown>>(`${this.baseUrl}/${AppConst.REQUESTS_URL.RESTART}/${id}`);
  }

  delete(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete<HttpResponse<unknown>>(`${this.baseUrl}${id}`);
  }
}
