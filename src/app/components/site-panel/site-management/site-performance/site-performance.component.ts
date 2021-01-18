import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { YearMonthIndicatorType } from '@shared/enums';
import { IndicatorsOptionValue, IYearMonthIndicatorOption } from '@shared/interfaces';
import { ISite } from '@sites/site-management/site-management.interface';
import { CurrentSiteService } from '@sites/site-management/site-management.service';
import { AppConst } from 'app/app.const';

import { SiteMenuMode, SiteMenuPage } from '../site-menu';

import { SitePerfomanceConst } from './site-perfomance.const';

@UntilDestroy()
@Component({
  selector: 'app-site-performance',
  templateUrl: './site-performance.component.html',
})
export class SitePerformanceComponent implements OnInit {
  currentPage: SiteMenuPage = SiteMenuPage.TECHNICAL;
  topics: IYearMonthIndicatorOption[] = [];
  topic: FormControl;
  indicatorsOptionValue: IndicatorsOptionValue;
  site: ISite;
  readonly menuMode: SiteMenuMode = SiteMenuMode.PERFORMANCE;
  readonly pages: typeof SiteMenuPage = SiteMenuPage;
  readonly tooltips = SitePerfomanceConst.SITE_PERFOMANCE_GENERAL;

  constructor(private currentSiteService: CurrentSiteService) {
  }

  changePage(page: SiteMenuPage) {
    this.currentPage = page;
    this.setTopic(page);
  }

  ngOnInit() {
    this.topic = new FormControl('', Validators.required);
    this.site = this.currentSiteService.getValue();

    this.topic.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((topic: IYearMonthIndicatorOption) => {
        this.prepareIndicatorsOptionValue(topic);
      });

    this.setTopic(this.currentPage);
  }

  setTopic(page: SiteMenuPage) {
    this.topics = page === SiteMenuPage.TECHNICAL ?
      [{ label: 'Consumption', url: AppConst.REQUESTS_URL.CONSUMPTIONS, type: YearMonthIndicatorType.CONSUMPTION }] :
      [
        { label: 'OPEX', url: AppConst.REQUESTS_URL.FINANCE_OPEX, type: YearMonthIndicatorType.OPEX },
        { label: 'Revenue', url: AppConst.REQUESTS_URL.REVENUES, type: YearMonthIndicatorType.REVENUE },
      ];

    if (this.topic) {
      this.topic.setValue(this.topics[0]);
      this.prepareIndicatorsOptionValue(this.topics[0]);
    }
  }

  private prepareIndicatorsOptionValue(topic: IYearMonthIndicatorOption) {
    this.indicatorsOptionValue = {
      topic,
      value: {
        optionId: this.site.id,
        commissioningDate: this.site.commissioningDate,
      },
    };
  }
}
