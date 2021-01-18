import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ILight } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MeteringTypeService {
  private listMeteringTypes: BehaviorSubject<ILight[]> = new BehaviorSubject<ILight[]>(null);
  constructor(private http: HttpClient) { }

  getAll(): Observable<ILight[]> {
    return this.http.get<ILight[]>(`${environment.apiUrl}${AppConst.REQUESTS_URL.METERING_TYPES}`)
      .pipe(tap((data: ILight[]) => this.setList(data)));
  }

  getListValue(): ILight[] {
    return this.listMeteringTypes.getValue();
  }

  setList(value: ILight[]) {
    this.listMeteringTypes.next(value);
  }

  claer() {
    this.listMeteringTypes.next(null);
  }
}
