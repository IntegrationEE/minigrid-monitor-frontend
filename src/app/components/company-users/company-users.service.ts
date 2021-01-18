import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { ICompanyUsers } from './company-users.interface';

@Injectable()
export class CompanyUsersService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.USERS}/`;
  constructor(private http: HttpClient) { }

  getAll(): Observable<ICompanyUsers[]> {
    return this.http.get<ICompanyUsers[]>(`${this.baseUrl}`);
  }

  approve(id: number): Observable<HttpResponse<unknown>> {
    return this.http.patch<HttpResponse<unknown>>(`${this.baseUrl}${id}${AppConst.REQUESTS_URL.APPROVE}`, {});
  }

  delete(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete<HttpResponse<unknown>>(`${this.baseUrl}${id}`);
  }

  toggleHeadOfCompany(id: number): Observable<HttpResponse<unknown>> {
    return this.http.patch<HttpResponse<unknown>>(`${this.baseUrl}${id}/${AppConst.REQUESTS_URL.HEAD_OF_COMPANY}`, {});
  }
}
