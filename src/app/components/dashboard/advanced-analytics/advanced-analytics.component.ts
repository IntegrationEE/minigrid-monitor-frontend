import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFilter } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { filter } from 'rxjs/operators';

import { OverviewMode } from '../dashboard.enum';
import { DashboardService } from '../dashboard.service';

import { AdvancedAnalyticsMode } from './advanced-analytics.enum';

@UntilDestroy()
@Component({
  selector: 'app-advanced-analytics',
  templateUrl: './advanced-analytics.component.html',
  styleUrls: ['./advanced-analytics.component.scss'],
})
export class AdvancedAnalyticsComponent implements OnInit {
  filters: IFilter;
  overviewMode: OverviewMode = OverviewMode.PORTFOLIO;
  mode: AdvancedAnalyticsMode = AdvancedAnalyticsMode.TECHNICAL;
  financialIconUrl: string = AppConst.ICONS.dollar;
  socialIconUrl: string = AppConst.ICONS.social;
  technicalIconUrl: string = AppConst.ICONS.technicalGreen;
  readonly modes: typeof AdvancedAnalyticsMode = AdvancedAnalyticsMode;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getFilters()
      .pipe(untilDestroyed(this), filter((filters: IFilter) => !!filters))
      .subscribe((filters: IFilter) => {
        this.filters = filters;
      });
  }

  changeView(mode: AdvancedAnalyticsMode) {
    this.financialIconUrl = AppConst.ICONS.dollar;
    this.socialIconUrl = AppConst.ICONS.social;
    this.technicalIconUrl = AppConst.ICONS.technical;

    this.mode = mode;
    switch (mode) {
      case AdvancedAnalyticsMode.FINANCIAL:
        this.financialIconUrl = AppConst.ICONS.dollarGreen;
        break;
      case AdvancedAnalyticsMode.SOCIAL:
        this.socialIconUrl = AppConst.ICONS.socialGreen;
        break;
      case AdvancedAnalyticsMode.TECHNICAL:
        this.technicalIconUrl = AppConst.ICONS.technicalGreen;
        break;
    }
  }
}
