import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFilter } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { filter } from 'rxjs/operators';

import { OverviewMode } from '../dashboard.enum';
import { DashboardService } from '../dashboard.service';

@UntilDestroy()
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  mode: OverviewMode = OverviewMode.PORTFOLIO;
  filters: IFilter;
  siteId: number;
  programmeId: number;
  siteIconUrl: string = AppConst.ICONS.location;
  programmeIconUrl: string = AppConst.ICONS.location;
  portfolioIconUrl: string = AppConst.ICONS.stack3DGreen;
  readonly modes: typeof OverviewMode = OverviewMode;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.setOverviewMode(this.mode);

    this.dashboardService.getFilters()
      .pipe(untilDestroyed(this), filter((filters: IFilter) => !!filters))
      .subscribe((filters: IFilter) => this.filters = filters);

    this.dashboardService.getSite()
      .pipe(untilDestroyed(this))
      .subscribe((siteId: number) => this.siteId = siteId);

    this.dashboardService.getProgrammeId()
      .pipe(untilDestroyed(this))
      .subscribe((programmeId: number) => this.programmeId = programmeId);

    this.dashboardService.getOverviewMode()
      .pipe(untilDestroyed(this))
      .subscribe((mode: OverviewMode) => {
        this.mode = mode;
        this.siteIconUrl = AppConst.ICONS.location;
        this.portfolioIconUrl = AppConst.ICONS.stack3D;
        this.programmeIconUrl = AppConst.ICONS.location;

        switch (mode) {
          case OverviewMode.PORTFOLIO:
            return this.portfolioIconUrl = AppConst.ICONS.stack3DGreen;
          case OverviewMode.SITE:
            return this.siteIconUrl = AppConst.ICONS.locationGreen;
          case OverviewMode.PROGRAMME:
            return this.programmeIconUrl = AppConst.ICONS.locationGreen;
        }
      });
  }

  changeView(mode: OverviewMode) {
    this.dashboardService.setOverviewMode(mode);
  }
}
