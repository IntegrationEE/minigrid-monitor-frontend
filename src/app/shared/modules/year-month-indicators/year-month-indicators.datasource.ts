import { MatTableDataSource } from '@angular/material/table';
import { orderBy } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { IYearMonthIndicator } from './year-month-indicators.interface';
import { YearMonthIndicatorsService } from './year-month-indicators.service';

export class YearMonthIndicatorTableDataSource<T extends IYearMonthIndicator> extends MatTableDataSource<T> {
  private count = new BehaviorSubject<number>(0);
  private loading = new BehaviorSubject<boolean>(false);

  constructor(private service: YearMonthIndicatorsService<T>) {
    super();
  }

  getCount(): Observable<number> {
    return this.count.asObservable();
  }

  getLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  load(url: string, commissioningDate: Date, isProgrammesIndicator: boolean) {
    this.loading.next(true);
    this.service.getData(url)
      .pipe(first())
      .subscribe((response: T[]) => {
        this.data = this.prepareEmptyRows(response, commissioningDate, isProgrammesIndicator);
        this.loading.next(false);
      });
  }

  addNewRow() {
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1;

    this.data.push({ year, month, active: true } as T);

    this.data = orderBy(this.data, ['year', 'month'], ['desc', 'desc']);

    this._updateChangeSubscription();
  }

  removeNewRow() {
    this.data = this.data.filter((elem: T) => !elem.isNewRow);

    this._updateChangeSubscription();
  }

  update(item: T) {
    const index: number = this.data.findIndex((elem: T): boolean => {
      return elem.year === item.year && elem.month === item.month || elem.isNewRow;
    });

    this.data[index] = item;

    this.data = orderBy(this.data, ['year', 'month'], ['desc', 'desc']);

    this._updateChangeSubscription();
  }

  private prepareEmptyRows(data: T[], commissiongDate: Date, isProgrammesIndicator: boolean): T[] {
    const currentDate: Date = new Date();

    if (!isProgrammesIndicator) {
      let year: number = commissiongDate.getFullYear();
      let month: number = commissiongDate.getMonth() + 1;

      while (year < currentDate.getFullYear() || month <= currentDate.getMonth() + 1) {
        if (data.findIndex((item: T) => item.month === month && item.year === year) === -1) {
          data.push({ year, month } as T);
        }

        if (month === 12) {
          month = 1;
          year++;
        } else {
          month++;
        }
      }
    }

    return orderBy(data, ['year', 'month'], ['desc', 'desc']);
  }
}
