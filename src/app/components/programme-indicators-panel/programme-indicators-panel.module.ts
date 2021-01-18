import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule, YearMonthIndicatorsModule } from '@shared/modules';
import { SharedModule } from '@shared/shared.module';

import * as MyProgrammeIndicators from './my-programme-indicators';
import * as Indicator from './programme-indicator-management';
import { ProgrammeIndicatorsPanelRouter } from './programme-indicators-panel-routing.module';
import { ProgrammeIndicatorsPanelComponent } from './programme-indicators-panel.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProgrammeIndicatorsPanelRouter,
    BreadcrumbsModule,
    YearMonthIndicatorsModule,
  ],
  declarations: [
    ProgrammeIndicatorsPanelComponent,
    MyProgrammeIndicators.MyProgrammeIndicatorsComponent,
    MyProgrammeIndicators.ProgrammeIndicatorCardComponent,
    Indicator.ProgrammeIndicatorManagementComponent,
    Indicator.ProgrammeIndicatorMetadataComponent,
  ],
  providers: [
    MyProgrammeIndicators.MyProgrammeIndicatorsService,
    Indicator.CurrentIndicatorService,
  ],
  entryComponents: [
  ],
})
export class ProgrammeIndicatorsPanelModule { }
