import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { ISiteStatus } from './site-menu.interface';

@Injectable()
export class SiteMenuService {
  constructor(private http: HttpClient) { }

  getStatus(id: number): Observable<ISiteStatus> {
    return this.http.get<ISiteStatus>(`${environment.apiUrl}${AppConst.REQUESTS_URL.SITES}/${id}${AppConst.REQUESTS_URL.STATUS}`);
  }
}
