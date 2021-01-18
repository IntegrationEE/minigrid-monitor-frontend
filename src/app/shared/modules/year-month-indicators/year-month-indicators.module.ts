import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { YearMonthIndicatorsUploadSummaryComponent } from './year-month-indicators-upload-summary/year-month-indicators-upload-summary.component';
import { YearMonthIndicatorsUploadModalComponent } from './year-month-indicators-upload/year-month-indicators-upload.component';
import { YearMonthIndicatorsComponent } from './year-month-indicators.component';
import { YearMonthIndicatorsService } from './year-month-indicators.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxMatFileInputModule,
  ],
  declarations: [
    YearMonthIndicatorsComponent,
    YearMonthIndicatorsUploadModalComponent,
    YearMonthIndicatorsUploadSummaryComponent,
  ],
  exports: [
    YearMonthIndicatorsComponent,
    YearMonthIndicatorsUploadModalComponent,
    YearMonthIndicatorsUploadSummaryComponent,
  ],
  providers: [
    YearMonthIndicatorsService,
  ],
  entryComponents: [
    YearMonthIndicatorsUploadModalComponent,
    YearMonthIndicatorsUploadSummaryComponent,
  ],
})
export class YearMonthIndicatorsModule {
}
