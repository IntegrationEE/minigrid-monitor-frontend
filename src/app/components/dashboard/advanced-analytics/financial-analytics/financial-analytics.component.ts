import { Component, Input } from '@angular/core';
import { FileService } from '@core/services';
import { ChartConfigService, DoughnutChartConfigService } from '@dashboard/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileFormat, FinancialChartType } from '@shared/enums';
import { IFilter } from '@shared/interfaces';
import { ChartMode, IChartConfig, IChartInsideText } from '@shared/modules';
import { CustomNumberPipe } from '@shared/pipes';

import { IFinancialData } from '../advanced-analytics.interface';
import { AdvancedAnalyticsService } from '../advanced-analytics.service';

@UntilDestroy()
@Component({
  selector: 'app-financial-analytics',
  templateUrl: './financial-analytics.component.html',
})
export class FinancialAnalyticsComponent {
  @Input() set setFilters(filters: IFilter) {
    this.fetchData(filters);
  }
  financingConfig: IChartConfig;
  capexConfig: IChartConfig;
  opexConfig: IChartConfig;
  revenueConfig: IChartConfig;
  opexInfo: IChartInsideText;
  capexInfo: IChartInsideText;
  readonly chartMode: ChartMode = ChartMode.ADVANCED;
  readonly chartTypes: typeof FinancialChartType = FinancialChartType;
  private filters: IFilter;

  constructor(private advancedAnalyticsService: AdvancedAnalyticsService,
              private fileService: FileService,
              private numberPipe: CustomNumberPipe,
              private chartConfigService: ChartConfigService,
              private doughnutChartConfigService: DoughnutChartConfigService) {
  }

  exportData(type: FinancialChartType, format: FileFormat) {
    this.fileService.downloadFinancial(type, format, this.filters)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private fetchData(filters: IFilter) {
    this.filters = filters;
    this.advancedAnalyticsService.getFinancialData(filters)
      .pipe(untilDestroyed(this))
      .subscribe((data: IFinancialData) => {
        this.financingConfig = this.chartConfigService.getHorizontalConfig(data.financingStructure.points);
        this.chartConfigService.setAdditionalConfiguration(this.financingConfig, data.financingStructure, true);

        this.capexConfig = this.doughnutChartConfigService.getConfig(data.capexStructure.points);
        this.chartConfigService.setAdditionalConfiguration(this.capexConfig, data.capexStructure, false);
        this.capexInfo = {
          title: this.numberPipe.transform(data.capexPricePerConnection),
          subtitle: 'per connection',
        };

        this.opexConfig = this.doughnutChartConfigService.getConfig(data.opexStructure.points);
        this.chartConfigService.setAdditionalConfiguration(this.opexConfig, data.opexStructure, false);
        this.opexInfo = {
          title: this.numberPipe.transform(data.opexPricePerConnection),
          subtitle: 'per connection',
        };

        this.revenueConfig = this.chartConfigService.getConfig(data.revenue.series);
        this.chartConfigService.setAdditionalConfiguration(this.revenueConfig, data.revenue, true);
        this.chartConfigService.setYaxisStep(this.revenueConfig, data.revenue.yaxisStep);
      });
  }
}
