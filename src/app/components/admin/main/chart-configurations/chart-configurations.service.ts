import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { IChartConfiguration } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartConfigurationsService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.CHART_CONFIGURATIONS}/`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IChartConfiguration[]> {
    return this.http.get<IChartConfiguration[]>(this.baseUrl);
  }

  update(id: number, data: IChartConfiguration): Observable<IChartConfiguration> {
    return this.http.patch<IChartConfiguration>(`${this.baseUrl}${id}`, data);
  }
}
