import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { YearMonthIndicatorsUploadSummaryComponent } from '../year-month-indicators-upload-summary';
import { IYearMonthIndicator } from '../year-month-indicators.interface';
import { YearMonthIndicatorsService } from '../year-month-indicators.service';

import { IYearMonthIndicatorsUpload, IYearMonthIndicatorsUploadResponse } from './year-month-indicators-upload.interface';

@UntilDestroy()
@Component({
  selector: 'app-year-month-indicators-upload',
  templateUrl: './year-month-indicators-upload.component.html',
})
export class YearMonthIndicatorsUploadModalComponent<T extends IYearMonthIndicator> {
  loading: boolean = false;
  fileControl: FormControl = new FormControl(null, Validators.required);

  constructor(public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: IYearMonthIndicatorsUpload,
              public dialogRef: MatDialogRef<YearMonthIndicatorsUploadModalComponent<T>>,
              private bottomSheet: MatBottomSheet,
              private service: YearMonthIndicatorsService<T>) {
  }

  onUpload() {
    this.loading = true;
    this.service.upload(this.data.url, this.getFormData())
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe((result: IYearMonthIndicatorsUploadResponse) => {
        this.bottomSheet.open(YearMonthIndicatorsUploadSummaryComponent, {
          hasBackdrop: false,
          data: result,
        }).afterOpened();
        this.dialogRef.close(result.outliers);
      });
  }

  private getFormData(): FormData {
    const uploadData: FormData = new FormData();
    const file: File = this.fileControl.value;

    uploadData.append('file', file, file.name);

    return uploadData;
  }
}
