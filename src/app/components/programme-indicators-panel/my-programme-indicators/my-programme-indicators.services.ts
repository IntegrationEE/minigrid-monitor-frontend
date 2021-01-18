import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';

import { IProgrammeIndicatorCard } from './my-programme-indicators.interface';

@Injectable()
export class MyProgrammeIndicatorsService {
  private refreshList: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private currentProgrammeId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.PROGRAMME_INDICATORS}/`;

  constructor(private http: HttpClient) { }

  getAll(programmeId: number): Observable<IProgrammeIndicatorCard[]> {
    return this.http.get<IProgrammeIndicatorCard[]>(`${this.baseUrl}${programmeId}/${AppConst.REQUESTS_URL.PROGRAMMES}`);
  }

  delete(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete<HttpResponse<unknown>>(`${this.baseUrl}${id}`);
  }

  enableDisable(id: number): Observable<IProgrammeIndicatorCard> {
    return this.http.patch<IProgrammeIndicatorCard>(`${this.baseUrl}${id}/${AppConst.REQUESTS_URL.TOGGLE}`, {});
  }

  getRefreshList(): Observable<boolean> {
    return this.refreshList.asObservable();
  }

  refreshIndicatorList() {
    this.refreshList.next(true);
  }

  getCurrentProgrammeId(): number {
    return this.currentProgrammeId.value ? this.currentProgrammeId.value : null;
  }

  setCurrentProgrammeId(programmeId: number) {
    this.currentProgrammeId.next(programmeId);
  }
}
