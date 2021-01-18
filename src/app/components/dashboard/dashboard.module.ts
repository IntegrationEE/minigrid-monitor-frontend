import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CustomChartsModule } from '@shared/modules';
import { SharedModule } from '@shared/shared.module';

import * as Advanced from './advanced-analytics';
import * as Core from './core';
import { DashboardRouter } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import * as Header from './header';
import * as Overview from './overview';

@NgModule({
  imports: [
    SharedModule,
    DashboardRouter,
    CustomChartsModule,
    LeafletModule,
  ],
  declarations: [
    DashboardComponent,
    Header.HeaderComponent,
    Header.HeaderFilterComponent,
    Header.HeaderListComponent,
    Header.HeaderMapComponent,
    Header.HeaderSliderComponent,
    Header.HeaderEnumComponent,
    Overview.OverviewComponent,
    Overview.GraphComponent,
    Overview.PortfolioComponent,
    Overview.ProgrammeComponent,
    Advanced.AdvancedAnalyticsComponent,
    Advanced.FinancialAnalyticsComponent,
    Advanced.SocialAnalyticsComponent,
    Advanced.TechnicalAnalyticsComponent,
  ],
  providers: [
    Header.HeaderService,
    Overview.OverviewService,
    Advanced.AdvancedAnalyticsService,
    DashboardService,
    Core.ChartConfigService,
    Core.DoughnutChartConfigService,
  ],
})
export class DashboardModule { }
