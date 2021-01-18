import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from '@rinminase/ng-charts';
import { SharedModule } from '@shared/shared.module';

import { ChartComponent } from './chart';
import { ChartWrapperComponent } from './chart-wrapper';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
  ],
  declarations: [
    ChartComponent,
    ChartWrapperComponent,
  ],
  exports: [
    ChartsModule,
    ChartComponent,
    ChartWrapperComponent,
  ],
})
export class CustomChartsModule {
}
