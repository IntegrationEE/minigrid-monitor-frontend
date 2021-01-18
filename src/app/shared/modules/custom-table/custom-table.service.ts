import { Injectable } from '@angular/core';
import { IBase } from '@shared/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

import { ITableAction } from './custom-table.interface';

@Injectable()
export class CustomTableService<T extends IBase> {
  private updatedRow = new BehaviorSubject<ITableAction<T>>(null);
  private rows: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private loading = new BehaviorSubject<boolean>(false);

  getRow(): Observable<ITableAction<T>> {
    return this.updatedRow.asObservable();
  }

  updateRow(value: ITableAction<T> = null) {
    this.updatedRow.next(value);
  }

  getRows(): Observable<T[]> {
    return this.rows.asObservable();
  }

  setRows(data: T[]) {
    this.rows.next(data);
  }

  getLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  setLoading(loading: boolean) {
    this.loading.next(loading);
  }
}
