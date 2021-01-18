import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BreadcrumbsModule, YearMonthIndicatorsModule } from '@shared/modules';
import { SharedModule } from '@shared/shared.module';

import * as MySites from './my-sites';
import * as Site from './site-management';
import { SitePanelRouter } from './site-panel-routing.module';
import { SitePanelComponent } from './site-panel.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SitePanelRouter,
    LeafletModule,
    BreadcrumbsModule,
    YearMonthIndicatorsModule,
  ],
  declarations: [
    SitePanelComponent,
    MySites.MySitesComponent,
    MySites.SiteCardComponent,
    Site.SiteManagementComponent,
    Site.SiteDetailsComponent,
    Site.SitePerformanceComponent,
    Site.SiteMenuComponent,
    Site.SiteInfoComponent,
    Site.TechnicalSpecsComponent,
    Site.FinancialDetailsComponent,
    Site.SocialIndicatorsComponent,
    Site.SocialIndicatorsFormComponent,
  ],
  providers: [
    MySites.MySitesService,
    Site.SiteMenuService,
    Site.SiteInfoService,
    Site.TechnicalSpecsService,
    Site.FinancialDetailsService,
    Site.CurrentSiteService,
    Site.SocialIndicatorsService,
  ],
  entryComponents: [
  ],
})
export class SitePanelModule { }
