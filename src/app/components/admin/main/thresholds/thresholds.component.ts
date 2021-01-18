import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThresholdsService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnType } from '@shared/enums';
import { IThreshold } from '@shared/interfaces';
import { CustomTableConst, CustomTableService, ITableAction, ITableConfig } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { ThresholdModalComponent } from './threshold-modal/threshold-modal.component';
import { ThresholdTable } from './thresholds.const';

@UntilDestroy()
@Component({
  selector: 'app-thresholds',
  templateUrl: './thresholds.component.html',
})
export class ThresholdsComponent implements OnInit {
  config: ITableConfig = {
    table: CustomTableConst.TABLES.THRESHOLDS,
    actions: {
      delete: false,
      edit: () => true,
      create: false,
    },
    columns: [
      { name: ThresholdTable.COLUMNS.NAME, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: ThresholdTable.COLUMNS.MIN, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: ThresholdTable.COLUMNS.MAX, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: ThresholdTable.COLUMNS.ACTIONS, type: ColumnType.ACTIONS },
    ],
  };

  constructor(private service: ThresholdsService,
              private tableServie: CustomTableService<IThreshold>,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.tableServie.setLoading(true);
    this.service.getAll()
      .pipe(untilDestroyed(this), finalize(() => this.tableServie.setLoading(false)))
      .subscribe((data: IThreshold[]) => {
        this.tableServie.setRows(data);
      });
  }

  openDialog(tableAction: ITableAction<IThreshold>) {
    this.dialog
      .open(ThresholdModalComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          action: tableAction.action,
          model: tableAction.model ? { ...tableAction.model } : {} as IThreshold,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: IThreshold) => {
        if (result) {
          this.tableServie.updateRow({ model: result, action: tableAction.action });
        }
      });
  }
}
