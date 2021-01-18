import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ConventionalTechnology, ConvertableType, GridConnection, RenewableTechnology, RoleCode, StorageTechnology } from '@shared/enums';
import { IEnum } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  private listRoles: BehaviorSubject<IEnum<RoleCode>[]> = new BehaviorSubject<IEnum<RoleCode>[]>(null);
  private renewableTechnologies: BehaviorSubject<IEnum<RenewableTechnology>[]> = new BehaviorSubject<IEnum<RenewableTechnology>[]>(null);
  private conventionalTechnologies: BehaviorSubject<IEnum<ConventionalTechnology>[]> =
    new BehaviorSubject<IEnum<ConventionalTechnology>[]>(null);
  private storageTechnologies: BehaviorSubject<IEnum<StorageTechnology>[]> = new BehaviorSubject<IEnum<StorageTechnology>[]>(null);
  private convertableTypes: BehaviorSubject<IEnum<ConvertableType>[]> = new BehaviorSubject<IEnum<ConvertableType>[]>(null);
  private listGridConnections: BehaviorSubject<IEnum<GridConnection>[]> = new BehaviorSubject<IEnum<GridConnection>[]>(null);
  private baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.ENUMS}/`;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<IEnum<RoleCode>[]> {
    return this.http.get<IEnum<RoleCode>[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.ROLES}`)
      .pipe(tap((data: IEnum<RoleCode>[]) => this.setRoles(data)));
  }

  getRenewableTechnologies(): Observable<IEnum<RenewableTechnology>[]> {
    return this.http.get<IEnum<RenewableTechnology>[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.RENEWABLE_TECHNOLOGIES}`)
      .pipe(tap((data: IEnum<RenewableTechnology>[]) => this.setRenewableTechnologies(data)));
  }

  getConventionalTechnologies(): Observable<IEnum<ConventionalTechnology>[]> {
    return this.http.get<IEnum<ConventionalTechnology>[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.CONVENTIONAL_TECHNOLOGIES}`)
      .pipe(tap((data: IEnum<ConventionalTechnology>[]) => this.setConventionalTechnologies(data)));
  }

  getStorageTechnologies(): Observable<IEnum<StorageTechnology>[]> {
    return this.http.get<IEnum<StorageTechnology>[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.STORAGE_TECHNOLOGIES}`)
      .pipe(tap((data: IEnum<StorageTechnology>[]) => this.setStorageTechnologies(data)));
  }

  getGridConnections(): Observable<IEnum<GridConnection>[]> {
    return this.http.get<IEnum<GridConnection>[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.GRID_CONNECTIONS}`)
      .pipe(tap((data: IEnum<GridConnection>[]) => this.setGridConnections(data)));
  }

  getConvertableTypes(): Observable<IEnum<ConvertableType>[]> {
    return this.http.get<IEnum<ConvertableType>[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.CONVERTABLE_TYPES}`)
      .pipe(tap((data: IEnum<ConvertableType>[]) => this.setConvertableTypes(data)));
  }

  getRolesValue(): IEnum<RoleCode>[] {
    return this.listRoles.getValue();
  }

  setRoles(value: IEnum<RoleCode>[]) {
    this.listRoles.next(value);
  }

  getRenewableTechnologiesValue(): IEnum<RenewableTechnology>[] {
    return this.renewableTechnologies.getValue();
  }

  getConventionalTechnologiesValue(): IEnum<ConventionalTechnology>[] {
    return this.conventionalTechnologies.getValue();
  }

  getStorageTechnologiesValue(): IEnum<StorageTechnology>[] {
    return this.storageTechnologies.getValue();
  }

  setRenewableTechnologies(value: IEnum<RenewableTechnology>[]) {
    this.renewableTechnologies.next(value);
  }

  setConventionalTechnologies(value: IEnum<ConventionalTechnology>[]) {
    this.conventionalTechnologies.next(value);
  }

  setStorageTechnologies(value: IEnum<StorageTechnology>[]) {
    this.storageTechnologies.next(value);
  }

  getGridConnectionsValue(): IEnum<GridConnection>[] {
    return this.listGridConnections.getValue();
  }

  setGridConnections(value: IEnum<GridConnection>[]) {
    this.listGridConnections.next(value);
  }

  setConvertableTypes(value: IEnum<ConvertableType>[]) {
    this.convertableTypes.next(value);
  }

  getConvertableTypesValue(): IEnum<ConvertableType>[] {
    return this.convertableTypes.getValue();
  }

  claer() {
    this.listRoles.next(null);
    this.renewableTechnologies.next(null);
    this.conventionalTechnologies.next(null);
    this.storageTechnologies.next(null);
    this.listGridConnections.next(null);
    this.convertableTypes.next(null);
  }
}
