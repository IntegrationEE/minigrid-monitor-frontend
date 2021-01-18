import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ILight } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalGovernmentAreaService {
  constructor(private http: HttpClient) { }

  getAllByStateId(stateId: number): Observable<ILight[]> {
    return this.http.get<ILight[]>(`${environment.apiUrl}${AppConst.REQUESTS_URL.LGA}/${stateId}/${AppConst.REQUESTS_URL.STATES}`);
  }
}
