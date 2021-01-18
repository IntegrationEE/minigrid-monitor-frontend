import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ILight } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

@Injectable()
export class ProgrammeManageService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.PROGRAMMES}/`;
  constructor(private http: HttpClient) { }

  getAll(): Observable<ILight[]> {
    return this.http.get<ILight[]>(this.baseUrl);
  }

  get(id: number): Observable<ILight> {
    return this.http.get<ILight>(`${this.baseUrl}${id}`);
  }

  create(data: ILight): Observable<ILight> {
    return this.http.post<ILight>(`${this.baseUrl}`, data);
  }

  update(id: number, data: ILight): Observable<ILight> {
    return this.http.patch<ILight>(`${this.baseUrl}${id}`, data);
  }

  delete(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete<HttpResponse<unknown>>(`${this.baseUrl}${id}`);
  }
}
