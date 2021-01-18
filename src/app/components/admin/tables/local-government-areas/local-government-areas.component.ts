import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomCookieService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnType, SettingsCode } from '@shared/enums';
import { CustomTableConst, CustomTableService, ITableAction, ITableColumn, ITableConfig } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { LocalGovernmentAreaModalComponent } from './local-government-area-modal/local-government-area-modal.component';
import { LocalGovernmentAreaTable } from './local-government-areas.const';
import { ILGA } from './local-government-areas.interface';
import { LocalGovernmentAreaManageService } from './local-government-areas.service';

@UntilDestroy()
@Component({
  selector: 'app-local-government-areas',
  templateUrl: './local-government-areas.component.html',
})
export class LocalGovernmentAreasComponent implements OnInit {
  config: ITableConfig = {
    table: CustomTableConst.TABLES.LGA,
    actions: {
      delete: true,
      edit: () => true,
      create: true,
    },
    columns: [
      { name: LocalGovernmentAreaTable.COLUMNS.NAME, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: LocalGovernmentAreaTable.COLUMNS.STATE, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: LocalGovernmentAreaTable.COLUMNS.ACTIONS, type: ColumnType.ACTIONS },
    ],
  };
  administrativeUnitLabel: string;

  constructor(private service: LocalGovernmentAreaManageService,
              private tableServie: CustomTableService<ILGA>,
              private dialog: MatDialog,
              private customCookieService: CustomCookieService) {
  }

  ngOnInit() {
    this.administrativeUnitLabel = this.customCookieService.get(SettingsCode[SettingsCode.ADMINISTRATIVE_UNIT_LABEL]);
    this.config.columns.find((column: ITableColumn) => column.name === LocalGovernmentAreaTable.COLUMNS.STATE)
      .title = this.administrativeUnitLabel;

    this.tableServie.setLoading(true);
    this.service.getAll()
      .pipe(untilDestroyed(this), finalize(() => this.tableServie.setLoading(false)))
      .subscribe((data: ILGA[]) => {
        this.tableServie.setRows(data);
      });
  }

  openDialog(tableAction: ITableAction<ILGA>) {
    this.dialog
      .open(LocalGovernmentAreaModalComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          action: tableAction.action,
          model: tableAction.model ? { ...tableAction.model } : {} as ILGA,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: ILGA) => {
        if (result) {
          this.tableServie.updateRow({ model: result, action: tableAction.action });
        }
      });
  }
}
