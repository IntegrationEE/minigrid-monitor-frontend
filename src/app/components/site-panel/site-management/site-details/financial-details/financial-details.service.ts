import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ISiteFinancialParameter } from '@sites/site-management';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

@Injectable()
export class FinancialDetailsService {
  private baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.FINANCE_CAPEX}/`;

  constructor(private http: HttpClient) { }

  get(id: number): Observable<ISiteFinancialParameter> {
    return this.http.get<ISiteFinancialParameter>(`${this.baseUrl}${id}`);
  }

  save(id: number, data: ISiteFinancialParameter): Observable<ISiteFinancialParameter> {
    return this.http.patch<ISiteFinancialParameter>(`${this.baseUrl}${id}`, data);
  }
}
