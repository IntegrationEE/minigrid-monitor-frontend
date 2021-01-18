import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { AppConst } from 'app/app.const';

import { IYearMonthIndicatorsUploadResponse } from '../year-month-indicators-upload';

@Component({
  selector: 'app-year-month-indicators-upload-summary',
  templateUrl: './year-month-indicators-upload-summary.component.html',
  styleUrls: ['./year-month-indicators-upload-summary.component.scss'],
})
export class YearMonthIndicatorsUploadSummaryComponent implements OnInit {
  readonly icons = AppConst.ICONS;

  constructor(private bottomSheetRef: MatBottomSheetRef<YearMonthIndicatorsUploadSummaryComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: IYearMonthIndicatorsUploadResponse) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.bottomSheetRef.dismiss();
    }, 5000);
  }

  progress(): number {
    return Math.round(this.data.inserted / (this.data.inserted + this.data.updated) * 10000) / 100;
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
