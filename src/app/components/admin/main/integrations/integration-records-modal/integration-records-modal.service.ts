import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { IIntegrationRecords } from '../integrations.interface';

@Injectable({
  providedIn: 'root',
})
export class IntegrationRecordsService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.INTEGRATION_RECORDS}/`;

  constructor(private http: HttpClient) { }

  getAll(id: number): Observable<IIntegrationRecords[]> {
    return this.http.get<IIntegrationRecords[]>(`${this.baseUrl}${id}`);
  }
}
