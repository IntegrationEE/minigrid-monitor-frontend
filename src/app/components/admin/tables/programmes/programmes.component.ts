import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnType } from '@shared/enums';
import { ILight } from '@shared/interfaces';
import { CustomTableConst, CustomTableService, ITableAction, ITableConfig } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { ProgrammeModalComponent } from './programme-modal/programme-modal.component';
import { ProgrammesTable } from './programmes.const';
import { ProgrammeManageService } from './programmes.service';

@UntilDestroy()
@Component({
  selector: 'app-programmes',
  templateUrl: './programmes.component.html',
})
export class ProgrammesComponent implements OnInit {
  config: ITableConfig = {
    table: CustomTableConst.TABLES.PROGRAMMES,
    actions: {
      delete: true,
      edit: () => true,
      create: true,
    },
    columns: [
      { name: ProgrammesTable.COLUMNS.NAME, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: ProgrammesTable.COLUMNS.ACTIONS, type: ColumnType.ACTIONS },
    ],
  };

  constructor(private service: ProgrammeManageService,
              private tableServie: CustomTableService<ILight>,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.tableServie.setLoading(true);
    this.service.getAll()
      .pipe(untilDestroyed(this), finalize(() => this.tableServie.setLoading(false)))
      .subscribe((data: ILight[]) => {
        this.tableServie.setRows(data);
      });
  }

  openDialog(tableAction: ITableAction<ILight>) {
    this.dialog
      .open(ProgrammeModalComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          action: tableAction.action,
          model: tableAction.model ? { ...tableAction.model } : {} as ILight,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: ILight) => {
        if (result) {
          this.tableServie.updateRow({ model: result, action: tableAction.action });
        }
      });
  }
}
