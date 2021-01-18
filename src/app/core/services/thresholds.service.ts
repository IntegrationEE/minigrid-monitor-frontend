import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { IThreshold } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThresholdsService {
  private listThresholds: BehaviorSubject<IThreshold[]> = new BehaviorSubject<IThreshold[]>(null);
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.THRESHOLDS}/`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IThreshold[]> {
    return this.http.get<IThreshold[]>(this.baseUrl)
      .pipe(tap((data: IThreshold[]) => this.setThresholds(data)));
  }

  update(data: IThreshold): Observable<IThreshold> {
    return this.http.patch<IThreshold>(`${this.baseUrl}`, data);
  }

  getThresholdsValue(): IThreshold[] {
    return this.listThresholds.getValue();
  }

  setThresholds(value: IThreshold[]) {
    this.listThresholds.next(value);
  }

  claer() {
    this.listThresholds.next(null);
  }
}
