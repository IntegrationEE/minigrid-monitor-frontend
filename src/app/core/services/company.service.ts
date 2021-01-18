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
export class CompanyService {
  private listCompanies: BehaviorSubject<ILight[]> = new BehaviorSubject<ILight[]>(null);
  constructor(private http: HttpClient) { }

  getList(): Observable<ILight[]> {
    return this.http.get<ILight[]>(`${environment.apiUrl}${AppConst.REQUESTS_URL.COMPANIES}${AppConst.REQUESTS_URL.LIST}`)
      .pipe(tap((data: ILight[]) => this.setList(data)));
  }

  getListValue(): ILight[] {
    return this.listCompanies.getValue();
  }

  setList(value: ILight[]) {
    this.listCompanies.next(value);
  }

  claer() {
    this.listCompanies.next(null);
  }
}
