import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { IntegrationRecordsTable } from '../integrations.const';
import { IIntegrationRecords } from '../integrations.interface';

import { IntegrationRecordsService } from './integration-records-modal.service';

@UntilDestroy()
@Component({
  selector: 'app-integration-records-modal',
  templateUrl: './integration-records-modal.component.html',
})
export class IntegrationRecordsModalComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<IIntegrationRecords>;
  readonly columns = IntegrationRecordsTable.COLUMNS;
  readonly displayedColumns: string[] = [
    IntegrationRecordsTable.COLUMNS.STATUS,
    IntegrationRecordsTable.COLUMNS.INSERTED,
    IntegrationRecordsTable.COLUMNS.STEP,
    IntegrationRecordsTable.COLUMNS.ERROR,
    IntegrationRecordsTable.COLUMNS.CREATED,
    IntegrationRecordsTable.COLUMNS.END_DATE,
  ];

  constructor(public dialogRef: MatDialogRef<IntegrationRecordsModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { integrationId: number },
              private service: IntegrationRecordsService) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.service.getAll(this.data.integrationId)
      .pipe(untilDestroyed(this))
      .subscribe((data: IIntegrationRecords[]) => {
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }
}
