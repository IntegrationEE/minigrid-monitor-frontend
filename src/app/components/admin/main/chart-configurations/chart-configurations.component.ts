import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnumService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnType, ConvertableType } from '@shared/enums';
import { IChartConfiguration, IEnum } from '@shared/interfaces';
import { CustomTableConst, CustomTableService, ITableAction, ITableConfig } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { ChartConfigurationModalComponent } from './chart-configuration-modal/chart-configuration-modal.component';
import { ChartConfigurationsTable } from './chart-configurations.const';
import { ChartConfigurationsService } from './chart-configurations.service';

@UntilDestroy()
@Component({
  selector: 'app-chart-configurations',
  templateUrl: './chart-configurations.component.html',
})
export class ChartConfigurationsComponent implements OnInit {
  config: ITableConfig = {
    table: CustomTableConst.TABLES.CHART_CONFIGURATIONS,
    actions: {
      delete: false,
      edit: () => true,
      create: false,
    },
    columns: [
      { name: ChartConfigurationsTable.COLUMNS.TYPE_NAME, title: 'Type', searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: ChartConfigurationsTable.COLUMNS.NAME, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: ChartConfigurationsTable.COLUMNS.TITLE, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: ChartConfigurationsTable.COLUMNS.TOOLTIP, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: ChartConfigurationsTable.COLUMNS.CONVERTABLE, searchable: true, sortable: true, type: ColumnType.CUSTOM },
      { name: ChartConfigurationsTable.COLUMNS.UNIT_OF_MEASURE, title: 'Unit of measure', searchable: true, sortable: true,
          type: ColumnType.GENERIC },
      { name: ChartConfigurationsTable.COLUMNS.IS_CUMULATIVE, title: 'Is cumulative', searchable: true, sortable: true,
          type: ColumnType.CHECK },
      { name: ChartConfigurationsTable.COLUMNS.ACTIONS, type: ColumnType.ACTIONS },
    ],
  };
  private convertableTypes: IEnum<ConvertableType>[] = [];

  constructor(private service: ChartConfigurationsService,
              private tableServie: CustomTableService<IChartConfiguration>,
              private dialog: MatDialog,
              private convertableTypeService: EnumService) {
  }

  ngOnInit() {
    this.fetchData();

    this.tableServie.setLoading(true);
  }

  openDialog(tableAction: ITableAction<IChartConfiguration>) {
    this.dialog
      .open(ChartConfigurationModalComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          action: tableAction.action,
          model: tableAction.model ? { ...tableAction.model } : {} as IChartConfiguration,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: IChartConfiguration) => {
        if (result) {
          this.tableServie.updateRow({ model: result, action: tableAction.action });
        }
      });
  }

  private fetchData() {
    this.tableServie.setLoading(true);
    this.convertableTypes = this.convertableTypeService.getConvertableTypesValue();
    if (!this.convertableTypes) {
      this.convertableTypeService.getConvertableTypes()
        .pipe(untilDestroyed(this))
        .subscribe((convertableTypes: IEnum<ConvertableType>[]) => this.convertableTypes = convertableTypes);
    }

    this.service.getAll()
      .pipe(untilDestroyed(this), finalize(() => this.tableServie.setLoading(false)))
      .subscribe((data: IChartConfiguration[]) => {
        this.tableServie.setRows(data);
      });
  }
}
