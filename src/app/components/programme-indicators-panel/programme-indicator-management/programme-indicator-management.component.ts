import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbsService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { YearMonthIndicatorType } from '@shared/enums';
import { IndicatorsOptionValue, IYearMonthIndicatorOption } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { IProgrammeIndicatorCard } from '../my-programme-indicators';

import { IProgrammeIndicator } from './programme-indicator-management.interface';
import { CurrentIndicatorService } from './programme-indicator-management.service';

@UntilDestroy()
@Component({
  selector: 'app-programme-indicator-management',
  templateUrl: './programme-indicator-management.component.html',
})
export class ProgrammeIndicatorManagementComponent implements OnInit, OnDestroy {
  @Input() set setIndicator(indicator: IProgrammeIndicatorCard) {
    this.indicatorId = indicator.id;

    if (this.indicatorId) {
      this.loading = true;
      this.indicatorService.get(this.indicatorId)
        .pipe(untilDestroyed(this), finalize(() => this.loading = false))
        .subscribe();
    } else {
      this.currentIndicatorService.setValue({ id: indicator.id } as IProgrammeIndicator);
      this.loading = false;
    }
  }
  indicatorId: number;
  indicatorsOptionValue: IndicatorsOptionValue;
  loading: boolean = true;

  constructor(private currentIndicatorService: CurrentIndicatorService,
              private indicatorService: CurrentIndicatorService,
              private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.prepareIndicatorsOptionValue();

    this.currentIndicatorService.getRefresh()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const indicator: IProgrammeIndicator = this.currentIndicatorService.getValue();

        if (indicator) {
          this.indicatorId = indicator.id;
          this.breadcrumbsService.setLabel(indicator.name);
          this.prepareIndicatorsOptionValue();
        }
      });
  }

  ngOnDestroy() {
    this.currentIndicatorService.setValue(null);
  }

  private prepareIndicatorsOptionValue() {
    const topic: IYearMonthIndicatorOption = {
      label: 'Programme Indicators',
      url: AppConst.REQUESTS_URL.PROGRAMME_INDICATOR_VALUES,
      type: YearMonthIndicatorType.PROGRAMME,
    };

    this.indicatorsOptionValue = {
      topic,
      value: {
        optionId: this.indicatorId,
        commissioningDate: null,
      },
    };
  }
}
