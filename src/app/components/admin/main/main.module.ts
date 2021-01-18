import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomTableModule } from '@shared/modules';
import { SharedModule } from '@shared/shared.module';

import * as ChartConfigurations from './chart-configurations';
import * as Integrations from './integrations';
import { MainRouting } from './main-routing.module';
import { MainComponent } from './main.component';
import * as Thresholds from './thresholds';
import * as Users from './users';

@NgModule({
  imports: [
    CommonModule,
    MainRouting,
    SharedModule,
    CustomTableModule,
  ],
  declarations: [
    MainComponent,
    ChartConfigurations.ChartConfigurationsComponent,
    ChartConfigurations.ChartConfigurationModalComponent,
    Integrations.IntegrationsComponent,
    Integrations.IntegrationModalComponent,
    Integrations.IntegrationRecordsModalComponent,
    Thresholds.ThresholdModalComponent,
    Thresholds.ThresholdsComponent,
    Users.ApproveModalComponent,
    Users.UserModalComponent,
    Users.UsersComponent,
  ],
  providers: [
    Users.UserService,
    ChartConfigurations.ChartConfigurationsService,
    Integrations.IntegrationsService,
    Integrations.IntegrationRecordsService,
  ],
  entryComponents: [
    Thresholds.ThresholdModalComponent,
    ChartConfigurations.ChartConfigurationModalComponent,
    Integrations.IntegrationModalComponent,
    Integrations.IntegrationRecordsModalComponent,
    Users.UserModalComponent,
    Users.ApproveModalComponent,
  ],
})
export class MainModule {
}
