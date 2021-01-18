import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { IUser } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { IApprove } from './approve-modal';

@Injectable()
export class UserService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.USERS}/`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.baseUrl);
  }

  get(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}${id}`);
  }

  create(data: IUser): Observable<IUser> {
    data.baseUrl = `${this.getBaseUrl()}${AppConst.MAIN_ROUTES.CONFIRM_EMAIL}`;

    return this.http.post<IUser>(`${this.baseUrl}`, data);
  }

  update(id: number, data: IUser): Observable<IUser> {
    return this.http.patch<IUser>(`${this.baseUrl}${id}`, data);
  }

  delete(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete<HttpResponse<unknown>>(`${this.baseUrl}${id}`);
  }

  approve(id: number, data: IApprove): Observable<HttpResponse<unknown>> {
    return this.http.patch<HttpResponse<unknown>>(`${this.baseUrl}${id}${AppConst.REQUESTS_URL.APPROVE}`, data);
  }

  private getBaseUrl(): string {
    return `${window.location.origin}/#/${AppConst.MAIN_ROUTES.AUTH}/`;
  }
}
