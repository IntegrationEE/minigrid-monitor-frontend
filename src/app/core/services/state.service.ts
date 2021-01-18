import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ILight, IStateMap } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private listStates: BehaviorSubject<ILight[]> = new BehaviorSubject<ILight[]>(null);
  private listStatesForMap: BehaviorSubject<IStateMap[]> = new BehaviorSubject<IStateMap[]>(null);
  private baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.STATES}`;

  constructor(private http: HttpClient) { }

  getList(): Observable<ILight[]> {
    return this.http.get<ILight[]>(this.baseUrl)
      .pipe(tap((data: ILight[]) => this.setList(data)));
  }

  getListForMap(): Observable<IStateMap[]> {
    return this.http.get<IStateMap[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.MAP}`)
      .pipe(tap((data: IStateMap[]) => this.setCoordinates(data)));
  }

  getListValue(): ILight[] {
    return this.listStates.getValue();
  }

  setList(value: ILight[]) {
    this.listStates.next(value);
  }

  getCoordinates(): Observable<IStateMap[]> {
    return this.listStatesForMap.asObservable();
  }

  getCoordinatesValue(): IStateMap[] {
    return this.listStatesForMap.getValue();
  }

  setCoordinates(value: IStateMap[]) {
    this.listStatesForMap.next(value);
  }

  claer() {
    this.listStates.next(null);
  }
}
