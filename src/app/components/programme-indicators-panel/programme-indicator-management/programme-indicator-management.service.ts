import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { IProgrammeIndicator } from '@indicators/programme-indicator-management';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CurrentIndicatorService {
  private current: BehaviorSubject<IProgrammeIndicator> = new BehaviorSubject(null);
  private refreshStatusSub: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.PROGRAMME_INDICATORS}/`;

  constructor(private http: HttpClient) { }

  get(id: number): Observable<IProgrammeIndicator> {
    return this.http.get<IProgrammeIndicator>(`${this.baseUrl}${id}`)
      .pipe(tap((response: IProgrammeIndicator) => this.setValue(response)));
  }

  update(id: number, data: IProgrammeIndicator): Observable<IProgrammeIndicator> {
    return this.http.patch<IProgrammeIndicator>(`${this.baseUrl}${id}`, data);
  }

  create(data: IProgrammeIndicator): Observable<IProgrammeIndicator> {
    return this.http.post<IProgrammeIndicator>(`${this.baseUrl}`, data);
  }

  getId(): number {
    return this.current.value ? this.current.value.id : null;
  }

  getValue(): IProgrammeIndicator {
    return this.current.value;
  }

  getRefresh(): Observable<boolean> {
    return this.refreshStatusSub.asObservable();
  }

  refreshStatus() {
    this.refreshStatusSub.next(true);
  }

  setValue(model: IProgrammeIndicator) {
    this.current.next(model);
  }
}
