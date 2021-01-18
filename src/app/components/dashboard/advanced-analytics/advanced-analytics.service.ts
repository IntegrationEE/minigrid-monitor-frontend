import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utils } from '@core/providers';
import { environment } from '@env/environment';
import { IFilter } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { IFinancialData, ISocialData, ITechnicalData } from './advanced-analytics.interface';

@Injectable()
export class AdvancedAnalyticsService {
  private baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.ADVANCED_ANALYTICS}/`;

  constructor(private http: HttpClient,
              private utils: Utils) {
  }

  getFinancialData(filters: IFilter): Observable<IFinancialData> {
    return this.http.post<IFinancialData>(`${this.baseUrl}${AppConst.REQUESTS_URL.FINANCIAL}`, this.utils.clearRequest(filters));
  }

  getSocialData(filters: IFilter): Observable<ISocialData> {
    return this.http.post<ISocialData>(`${this.baseUrl}${AppConst.REQUESTS_URL.SOCIAL}`, this.utils.clearRequest(filters));
  }

  getTechnicalData(filters: IFilter): Observable<ITechnicalData> {
    return this.http.post<ITechnicalData>(`${this.baseUrl}${AppConst.REQUESTS_URL.TECHNICAL}`, this.utils.clearRequest(filters));
  }
}
