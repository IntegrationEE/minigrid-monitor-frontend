import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, ColumnType, ConvertableType, RoleCode } from '@shared/enums';
import { IBase } from '@shared/interfaces';
import { AppConst } from 'app/app.const';

import { CustomTableConst } from './custom-table.const';
import { CustomTableDataSource } from './custom-table.datasource';
import { ITableAction, ITableColumn, ITableConfig } from './custom-table.interface';
import { CustomTableService } from './custom-table.service';

@UntilDestroy()
@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
})
export class CustomTableComponent<T extends IBase> implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() set setConfig(config: ITableConfig) {
    this.config = config;
    this.displayedColumns = config.columns.map((col: ITableColumn): string => col.name);
  }
  @Output() onAction: EventEmitter<ITableAction<T>> = new EventEmitter();

  config: ITableConfig;
  dataSource: CustomTableDataSource<T>;
  displayedColumns: string[];
  filter: string;
  loading: boolean = true;
  readonly icons = AppConst.ICONS;
  readonly actionType: typeof Action = Action;
  readonly columnType: typeof ColumnType = ColumnType;

  constructor(private service: CustomTableService<T>) { }

  ngOnInit() {
    this.dataSource = new CustomTableDataSource<T>();

    this.service.getLoading()
      .pipe(untilDestroyed(this))
      .subscribe((loading: boolean) => this.loading = loading);

    this.service.getRows()
      .pipe(untilDestroyed(this))
      .subscribe((data: T[]) => {
        this.dataSource.data = data;
      });

    this.service.getRow()
      .pipe(untilDestroyed(this))
      .subscribe((update: ITableAction<T>) => {
        if (update && update.model) {
          this.dataSource.update(update);
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getValue(element: T, col: ITableColumn): string {
    if (typeof (element[col.name]) === 'string') {
      return element[col.name];
    }

    switch (this.config.table) {
      case CustomTableConst.TABLES.USERS:
        return RoleCode[element[col.name]];
      case CustomTableConst.TABLES.CHART_CONFIGURATIONS:
        return ConvertableType[element[col.name]];
      default:
        return '';
    }
  }

  onFilter(value: string) {
    this.dataSource.filter = value;
  }

  openDialog(model: T = null, action: Action = null) {
    this.onAction.emit({ model, action } as ITableAction<T>);
  }
}
