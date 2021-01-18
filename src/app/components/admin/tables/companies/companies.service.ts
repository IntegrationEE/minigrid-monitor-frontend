import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ICompany } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyManageService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.COMPANIES}/`;
  constructor(private http: HttpClient) { }

  getAll(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(`${this.baseUrl}`);
  }

  get(id: number): Observable<ICompany> {
    return this.http.get<ICompany>(`${this.baseUrl}${id}`);
  }

  create(data: ICompany): Observable<ICompany> {
    return this.http.post<ICompany>(`${this.baseUrl}`, data);
  }

  update(id: number, data: ICompany): Observable<ICompany> {
    return this.http.patch<ICompany>(`${this.baseUrl}${id}`, data);
  }

  delete(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete<HttpResponse<unknown>>(`${this.baseUrl}${id}`);
  }
}
