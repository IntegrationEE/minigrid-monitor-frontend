import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomCookieService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, ColumnType, SettingsCode } from '@shared/enums';
import { ICompany } from '@shared/interfaces';
import { CustomTableConst, CustomTableService, ITableAction, ITableColumn, ITableConfig } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { CompaniesTable } from './companies.const';
import { CompanyManageService } from './companies.service';
import { CompanyModalComponent } from './company-modal/company-modal.component';

@UntilDestroy()
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
})
export class CompaniesComponent implements OnInit {
  config: ITableConfig = {
    table: CustomTableConst.TABLES.COMPANIES,
    actions: {
      delete: true,
      edit: () => true,
      create: true,
    },
    columns: [
      { name: CompaniesTable.COLUMNS.NAME, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: CompaniesTable.COLUMNS.CITY, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: CompaniesTable.COLUMNS.STREET, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: CompaniesTable.COLUMNS.STATE, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: CompaniesTable.COLUMNS.LGA, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: CompaniesTable.COLUMNS.PHONE_NUMBER, title: 'Phone Number', searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: CompaniesTable.COLUMNS.ACTIONS, type: ColumnType.ACTIONS },
    ],
  };
  lgaLabel: string;
  administrativeUnitLabel: string;

  constructor(private service: CompanyManageService,
              private tableServie: CustomTableService<ICompany>,
              private dialog: MatDialog,
              private customCookieService: CustomCookieService) {
  }

  ngOnInit() {
    this.lgaLabel = this.customCookieService.get(SettingsCode[SettingsCode.LGA_LABEL]);
    this.administrativeUnitLabel = this.customCookieService.get(SettingsCode[SettingsCode.ADMINISTRATIVE_UNIT_LABEL]);
    this.config.columns.find((column: ITableColumn) => column.name === CompaniesTable.COLUMNS.STATE).title = this.administrativeUnitLabel;
    this.config.columns.find((column: ITableColumn) => column.name === CompaniesTable.COLUMNS.LGA).title = this.lgaLabel;

    this.tableServie.setLoading(true);
    this.service.getAll()
      .pipe(untilDestroyed(this), finalize(() => this.tableServie.setLoading(false)))
      .subscribe((data: ICompany[]) => {
        this.tableServie.setRows(data);
      });
  }

  openDialog(tableAction: ITableAction<ICompany>) {
    if (tableAction.action === Action.EDIT) {
      this.service.get(tableAction.model.id)
        .pipe(untilDestroyed(this))
        .subscribe((response: ICompany) => {
          this.initDialog(response, tableAction.action);
        });
    } else {
      this.initDialog(tableAction.model ? { ...tableAction.model } : {} as ICompany, tableAction.action);
    }
  }

  private initDialog(model: ICompany, action: Action) {
    this.dialog
      .open(CompanyModalComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          action,
          model,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: ICompany) => {
        this.tableServie.updateRow({ model: result, action });
      });
  }
}
