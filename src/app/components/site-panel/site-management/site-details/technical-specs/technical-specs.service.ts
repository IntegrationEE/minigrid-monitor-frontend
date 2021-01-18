import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ISiteTechnicalParameter } from '@sites/site-management';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TechnicalSpecsService {
  private baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.SITE_TECHNICAL_PARAMETERS}/`;

  constructor(private http: HttpClient) { }

  get(id: number): Observable<ISiteTechnicalParameter> {
    return this.http.get<ISiteTechnicalParameter>(`${this.baseUrl}${id}`)
      .pipe(map((data: ISiteTechnicalParameter) => {
        if (data && !data.conventionalTechnology) { data.conventionalTechnology = -1; }
        if (data && !data.storageTechnology) { data.storageTechnology = -1; }

        return data;
      }));
  }

  save(id: number, data: ISiteTechnicalParameter): Observable<ISiteTechnicalParameter> {
    if (data.conventionalTechnology === -1) { data.conventionalTechnology = null; }
    if (data.storageTechnology === -1) { data.storageTechnology = null; }

    return this.http.patch<ISiteTechnicalParameter>(`${this.baseUrl}${id}`, data);
  }
}
