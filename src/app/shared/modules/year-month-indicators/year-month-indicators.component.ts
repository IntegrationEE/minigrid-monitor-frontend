import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageHandler } from '@core/providers';
import { FileService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnType, FileFormat, YearMonthIndicatorType } from '@shared/enums';
import { IndicatorsOptionValue, IYearMonthIndicatorOption } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { YearMonthIndicatorsUploadModalComponent } from './year-month-indicators-upload';
import { YearMonthIndicatorTableConst } from './year-month-indicators.const';
import { YearMonthIndicatorTableDataSource } from './year-month-indicators.datasource';
import {
  IYearMonthIndicator,
  IYearMonthIndicatorColumn,
  IYearMonthIndicatorConfig,
  IYearMonthIndicatorOutliers,
  IYearMonthIndicatorValidation,
} from './year-month-indicators.interface';
import { YearMonthIndicatorsService } from './year-month-indicators.service';

@UntilDestroy()
@Component({
  selector: 'app-year-month-indicators',
  templateUrl: './year-month-indicators.component.html',
  styleUrls: ['./year-month-indicators.component.scss'],
})
export class YearMonthIndicatorsComponent<T extends IYearMonthIndicator> implements AfterViewInit {
  @Input() set setIndicatorsOptionValue(value: IndicatorsOptionValue) {
    if (value) {
      this.initValues(value);
    }
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  topic: IYearMonthIndicatorOption;
  config: IYearMonthIndicatorConfig;
  dataSource: YearMonthIndicatorTableDataSource<T>;
  displayedColumns: string[];
  enterDataToolTip: string;
  editMode: boolean;
  formGroup: FormGroup;
  outliersData: IYearMonthIndicatorOutliers[] = [];
  saveAfterValidation: boolean;
  loading: boolean = true;
  isProgrammesIndicator: boolean;
  optionId: number;
  commissioningDate: Date;
  readonly icons = AppConst.ICONS;
  readonly generals = AppConst.GENERAL;
  readonly tooltips = YearMonthIndicatorTableConst.TOOLTIPS;
  readonly downloadIconUrl: string = AppConst.ICONS.downloadGreen;
  readonly columnType: typeof ColumnType = ColumnType;
  private selectedType: YearMonthIndicatorType;

  constructor(private dialog: MatDialog,
              private yearMonthIndicatorService: YearMonthIndicatorsService<T>,
              private messageHandler: MessageHandler,
              private formBuilder: FormBuilder,
              private fileService: FileService) {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  toggleEditMode(row: T = null) {
    row.active = !row.active;

    if (row.active) {
      for (const column of this.config.columns) {
        if (column.editable) {
          this.formGroup.addControl(column.name,
            new FormControl(row[column.name], [Validators.min(0)]));
        }
      }
      this.editMode = true;
      row.previousData = { ...row };
    }
  }

  onCancelRow(row: T) {
    if (row && row.isNewRow) {
      this.dataSource.removeNewRow();
    } else {
      for (const key of Object.keys(row)) {
        if (key !== 'previousData') {
          row[key] = row.previousData[key];
        }
      }
      row.active = false;
      delete row.previousData;
    }

    this.editMode = false;
    this.destroyControls();
  }

  onSaveRow(row: T) {
    if (!this.checkAtLeastOneColumnIsFilled()) {
      switch (this.selectedType) {
        case YearMonthIndicatorType.CONSUMPTION:
          return this.messageHandler.handleMessageInfo('At least \'TOTAL\' column must be filled in.');
        default:
          return this.messageHandler.handleMessageInfo('At least one column must be filled in.');
      }
    }
    if (!this.saveAfterValidation) {
      this.yearMonthIndicatorService.validate(this.config.url, ({ ...this.formGroup.value, id: row.id, month: row.month, year: row.year }))
        .pipe(untilDestroyed(this))
        .subscribe((response: IYearMonthIndicatorValidation) => {
          if (response.isValid) {
            this.goToActions(row);
          } else {
            this.filterOutliersData(row);
            this.outliersData.push(response.outliers);
            this.saveAfterValidation = true;
            this.messageHandler.handleMessageInfo('Some cells have outliers. Please confirm if you want to save this data.');
          }
        });
    } else {
      this.goToActions(row);
    }
  }

  addNewRow() {
    this.dataSource.addNewRow();

    this.dataSource.filteredData.forEach((row: T) => {
      if (row.active) {
        for (const column of this.config.columns) {
          this.formGroup.addControl(column.name, new FormControl(row[column.name]));
        }
        this.editMode = true;

        row.previousData = { ...row };
        row.isNewRow = true;
      }
    });
  }

  downloadData() {
    this.fileService.downloadYearMonthIndicatos(this.config.url, this.optionId, this.selectedType, FileFormat.XLS)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  getStyle(element: T, col: { name: string, type: number }) {
    if (this.outliersData) {
      let outlierValue = false;

      this.outliersData.forEach((item: IYearMonthIndicatorOutliers) => {
        if (element.year === item.year && element.month === item.month && item.properties.includes(col.name)) {

          return outlierValue = true;
        }
      });

      if (outlierValue) {
        outlierValue = false;

        return 'outliersColor';
      }
    }
  }

  isSaveEnabled(): boolean {
    return this.formGroup.valid && this.checkTotal();
  }

  uploadData() {
    this.dialog
      .open(YearMonthIndicatorsUploadModalComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          url: this.config.url,
          title: this.topic.label,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((outliers: IYearMonthIndicatorOutliers[]) => {
        if (outliers) {
          this.outliersData = outliers;
          this.loadData(this.topic);
        }
      });
  }

  checkTotal(): boolean {
    switch (this.selectedType) {
      case YearMonthIndicatorType.CONSUMPTION:
        return this.formGroup.value.commercial + this.formGroup.value.peakLoad + this.formGroup.value.productive
          + this.formGroup.value.public + this.formGroup.value.residential <= this.formGroup.value.total;
      default:
        return true;
    }
  }

  private checkAtLeastOneColumnIsFilled(): boolean {
    let isFilled: boolean = false;

    Object.keys(this.formGroup.controls).forEach((control: string) => {
      if (this.formGroup.value[control]) {
        isFilled = true;
      }
    });

    return isFilled;
  }

  private goToActions(row: T) {
    delete row.previousData;
    const previousData: T = { ...row.previousData as T };

    this.getAction({
      ...this.formGroup.value, id: row.id, month: this.formGroup.value.month || row.month,
      year: this.formGroup.value.year || row.year,
    })
      .pipe(untilDestroyed(this))
      .subscribe((response: T) => {
        this.dataSource.update(response);
        this.editMode = false;
        row.active = false;
        this.destroyControls();
        this.messageHandler.handleMessageInfo('Record was successfully saved.');
        this.filterOutliersData(row);
        this.saveAfterValidation = false;
      }, () => row.previousData = previousData);
  }

  private getAction(item: T): Observable<T> {
    return item.id ?
      this.yearMonthIndicatorService.update(this.config.url, item.id, item) :
      this.yearMonthIndicatorService.create(this.config.url, item);
  }

  private initValues(optionValue: IndicatorsOptionValue) {
    this.topic = optionValue && optionValue.topic;
    this.optionId = optionValue && optionValue.value && optionValue.value.optionId;
    this.isProgrammesIndicator = this.topic && this.topic.type && this.topic.type === YearMonthIndicatorType.PROGRAMME;
    this.yearMonthIndicatorService.setOptionId(this.optionId);
    this.commissioningDate = optionValue && optionValue.value && optionValue.value.commissioningDate;
    this.loadData(this.topic);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private filterOutliersData(row: T) {
    this.outliersData = this.outliersData.filter((item: IYearMonthIndicatorOutliers) => {
      return item.month !== row.month || item.year !== row.year;
    });
  }

  private loadData(topic: IYearMonthIndicatorOption) {
    this.formGroup = this.formBuilder.group({});
    this.selectedType = topic.type;
    this.setTooltip(this.selectedType);
    this.config = this.yearMonthIndicatorService.getConfig(topic);
    this.displayedColumns = this.config.columns.map((col: IYearMonthIndicatorColumn): string => col.name);
    this.dataSource = new YearMonthIndicatorTableDataSource<T>(this.yearMonthIndicatorService);
    this.dataSource.load(this.config.url, this.commissioningDate, this.isProgrammesIndicator);
  }

  private destroyControls() {
    for (const column of this.config.columns) {
      this.formGroup.removeControl(column.name);
    }
  }

  private setTooltip(type: YearMonthIndicatorType) {
    switch (type) {
      case YearMonthIndicatorType.OPEX:
        this.enterDataToolTip = this.tooltips.ENTER_DATA_OPEX;
        break;
      case YearMonthIndicatorType.REVENUE:
        this.enterDataToolTip = this.tooltips.ENTER_DATA_REVENUE;
        break;
      case YearMonthIndicatorType.CONSUMPTION:
        this.enterDataToolTip = this.tooltips.ENTER_DATA_CONSUMPTION;
        break;
      case YearMonthIndicatorType.PROGRAMME:
        this.enterDataToolTip = this.tooltips.ENTER_DATA_PROGRAMME;
        break;
    }
  }
}
