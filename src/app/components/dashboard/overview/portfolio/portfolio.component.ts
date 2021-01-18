import { Component, Input, OnInit } from '@angular/core';
import { AuthenticateService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFilter } from '@shared/interfaces';
import { ChartMode } from '@shared/modules';
import { AppConst } from 'app/app.const';

import { OverviewService } from '../overview.service';

import { IPortfolioChart, IPortfolioCharts } from './portfolio.interface';

@UntilDestroy()
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {
  @Input() set setFilters(filters: IFilter) {
    this.fetchData(filters);
  }
  model: IPortfolioCharts;
  isGuest: boolean;
  socialIconUrl: string = AppConst.ICONS.social;
  technicalIconUrl: string = AppConst.ICONS.technical;
  financialIconUrl: string = AppConst.ICONS.dollar;
  readonly chartMode: ChartMode = ChartMode.PORTFOLIO;

  constructor(private overviewService: OverviewService<IPortfolioChart>,
              private authService: AuthenticateService) {
  }

  ngOnInit() {
    this.isGuest = this.authService.isGuest();
  }

  private fetchData(filters: IFilter) {
    this.overviewService.getPortfolioCharts(filters)
      .pipe(untilDestroyed(this))
      .subscribe((response: IPortfolioCharts) => {
        this.model = response;

        this.overviewService.setChartConfig(response.peopleConnected);
        this.overviewService.setChartConfig(response.installedRenewableEnergyCapacity);
        this.overviewService.setChartConfig(response.totalInvestment);
        this.overviewService.setChartConfig(response.communitiesConnected);
        this.overviewService.setChartConfig(response.electricityConsumed);
        this.overviewService.setChartConfig(response.averageTariff);
      });
  }
}
