import { MatTableDataSource } from '@angular/material/table';
import { Action } from '@shared/enums';
import { IBase } from '@shared/interfaces';

import { ITableAction } from './custom-table.interface';

export class CustomTableDataSource<T extends IBase> extends MatTableDataSource<T> {

  update(tableAction: ITableAction<T>) {
    const data: T[] = this.data;
    const index: number = this.data.findIndex((elem: T): boolean => elem.id === tableAction.model.id);

    if (tableAction.action === Action.DELETE) {
      data.splice(index, 1);
    } else {
      data[index] = tableAction.model;
    }

    this._updateChangeSubscription();
  }
}
