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
export class ProgrammeService {
  private listProgrammes: BehaviorSubject<ILight[]> = new BehaviorSubject<ILight[]>(null);
  constructor(private http: HttpClient) { }

  getAll(): Observable<ILight[]> {
    return this.http.get<ILight[]>(`${environment.apiUrl}${AppConst.REQUESTS_URL.PROGRAMMES}`)
      .pipe(tap((data: ILight[]) => this.setList(data)));
  }

  getByCurrent(): Observable<ILight[]> {
    return this.http.get<ILight[]>(`${environment.apiUrl}${AppConst.REQUESTS_URL.PROGRAMMES}${AppConst.REQUESTS_URL.CURRENT}`)
      .pipe(tap((data: ILight[]) => this.setList(data)));
  }

  getListValue(): ILight[] {
    return this.listProgrammes.getValue();
  }

  setList(value: ILight[]) {
    this.listProgrammes.next(value);
  }

  claer() {
    this.listProgrammes.next(null);
  }
}
