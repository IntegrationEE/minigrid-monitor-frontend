import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnumService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { OverviewMode } from './dashboard.enum';
import { DashboardService } from './dashboard.service';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  overviewMode: OverviewMode;
  readonly modes: typeof OverviewMode = OverviewMode;

  constructor(private dashboardService: DashboardService,
              private enumService: EnumService) {
  }

  ngOnInit() {
    this.dashboardService.getOverviewMode()
      .pipe(untilDestroyed(this))
      .subscribe((mode: OverviewMode) => {
        this.overviewMode = mode;
      });
  }

  ngOnDestroy() {
    this.dashboardService.setSite(null);
    this.dashboardService.setProgrammeId(null);
    this.enumService.setRenewableTechnologies(null);
  }
}
