import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageHandler } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, ColumnType } from '@shared/enums';
import { CustomTableConst, CustomTableService, ITableAction, ITableConfig } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { IntegrationModalComponent } from './integration-modal/integration-modal.component';
import { IntegrationRecordsModalComponent } from './integration-records-modal/integration-records-modal.component';
import { Integrations, IntegrationsTable } from './integrations.const';
import { IIntegration } from './integrations.interface';
import { IntegrationsService } from './integrations.service';

@UntilDestroy()
@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
})
export class IntegrationsComponent implements OnInit {
  config: ITableConfig = {
    table: CustomTableConst.TABLES.INTEGRATIONS,
    actions: {
      delete: true,
      edit: () => true,
      create: true,
      customs: [
        {
          enabled: () => true,
          label: Integrations.BUTTONS.EXECUTE,
          action: (id: number) => {
            this.restartIntegration(id);
          },
        }, {
          enabled: () => true,
          label: Integrations.BUTTONS.SHOW_RUNS,
          action: (id: number) => {
            this.initRecordsDialog(id);
          },
        },
      ],
    },
    columns: [
      { name: IntegrationsTable.COLUMNS.NAME, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: IntegrationsTable.COLUMNS.TOKEN, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: IntegrationsTable.COLUMNS.QUESTION_HASH, title: 'Question hash', searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: IntegrationsTable.COLUMNS.INTERVAL, title: 'Interval (day)', searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: IntegrationsTable.COLUMNS.IS_ACTIVE, title: 'Is Active', searchable: true, sortable: true, type: ColumnType.CHECK },
      { name: IntegrationsTable.COLUMNS.ACTIONS, type: ColumnType.ACTIONS },
    ],
  };

  constructor(private service: IntegrationsService,
              private tableServie: CustomTableService<IIntegration>,
              private messageHandler: MessageHandler,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.tableServie.setLoading(true);
    this.service.getAll()
      .pipe(untilDestroyed(this), finalize(() => this.tableServie.setLoading(false)))
      .subscribe((data: IIntegration[]) => {
        this.tableServie.setRows(data);
      });
  }

  openDialog(tableAction: ITableAction<IIntegration>) {
    switch (tableAction.action) {
      case Action.EDIT:
        this.service.get(tableAction.model.id)
          .pipe(untilDestroyed(this))
          .subscribe((response: IIntegration) => {
            this.initDialog(response, tableAction.action);
          });
        break;
      case Action.CREATE:
      case Action.DELETE:
        this.initDialog(tableAction.model ? { ...tableAction.model } : { steps: [] } as IIntegration, tableAction.action);
        break;
    }
  }

  private restartIntegration(id: number) {
    this.service.restart(id)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.messageHandler.handleMessageInfo('Integration successfully restarted.');
      });
  }

  private initDialog(model: IIntegration, action: Action) {
    this.dialog
      .open(IntegrationModalComponent, {
        width: AppConst.MODAL_SIZES.VERY_BIG,
        data: {
          action,
          model,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: IIntegration) => {
        this.tableServie.updateRow({ model: result, action });
      });
  }

  private initRecordsDialog(integrationId: number) {
    this.dialog
      .open(IntegrationRecordsModalComponent, {
        width: AppConst.MODAL_SIZES.ULTRA_LARGE,
        data: {
          integrationId,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}
