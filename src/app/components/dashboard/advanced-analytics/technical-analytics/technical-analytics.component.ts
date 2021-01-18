import { Component, Input } from '@angular/core';
import { FileService, SettingsService } from '@core/services';
import { ChartConfigService } from '@dashboard/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileFormat, TechnicalChartType } from '@shared/enums';
import { IFilter } from '@shared/interfaces';
import { ChartMode, IChartConfig } from '@shared/modules';

import { OverviewMode } from '../../dashboard.enum';
import { ITechnicalData } from '../advanced-analytics.interface';
import { AdvancedAnalyticsService } from '../advanced-analytics.service';

@UntilDestroy()
@Component({
  selector: 'app-technical-analytics',
  templateUrl: './technical-analytics.component.html',
})
export class TechnicalAnalyticsComponent {
  @Input() set setFilters(filters: IFilter) {
    this.overviewMode = filters.level || OverviewMode.PORTFOLIO;
    this.fetchData(filters);
  }
  overviewMode: OverviewMode;
  installedCapacityConfig: IChartConfig;
  electricityConfig: IChartConfig;
  averageConsumptionConfig: IChartConfig;
  capacityUtilizationConfig: IChartConfig;
  dailyProfileConfig: IChartConfig;
  showDailyProfile: boolean;
  readonly chartMode: ChartMode = ChartMode.ADVANCED;
  readonly overviewModes: typeof OverviewMode = OverviewMode;
  readonly chartTypes: typeof TechnicalChartType = TechnicalChartType;
  private filters: IFilter;

  constructor(private advancedAnalyticsService: AdvancedAnalyticsService,
              private fileService: FileService,
              private settingService: SettingsService,
              private chartConfigService: ChartConfigService) {
  }

  exportData(type: TechnicalChartType, format: FileFormat) {
    this.fileService.downloadTechnical(type, format, this.filters)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private fetchData(filters: IFilter) {
    this.showDailyProfile = this.settingService.getDailyProfile();
    this.filters = filters;
    this.advancedAnalyticsService.getTechnicalData(filters)
      .pipe(untilDestroyed(this))
      .subscribe((data: ITechnicalData) => {
        switch (this.overviewMode) {
          case OverviewMode.PORTFOLIO:
            this.installedCapacityConfig = this.chartConfigService.getConfig(data.installedCapacity.series);
            this.chartConfigService.setAdditionalConfiguration(this.installedCapacityConfig, data.installedCapacity, true);
            this.chartConfigService.setYaxisStep(this.installedCapacityConfig, data.installedCapacity.yaxisStep);
            break;
          case OverviewMode.SITE:
            this.dailyProfileConfig = this.chartConfigService.getLineFilledConfig(data.dailyProfile.series, 'hour');
            this.chartConfigService.setAdditionalConfiguration(this.dailyProfileConfig, data.dailyProfile, true);
            break;
        }

        this.electricityConfig = this.chartConfigService.getConfig(data.electricityConsumption.series);
        this.chartConfigService.setAdditionalConfiguration(this.electricityConfig, data.electricityConsumption, true);
        this.chartConfigService.setYaxisStep(this.electricityConfig, data.electricityConsumption.yaxisStep);

        this.averageConsumptionConfig = this.chartConfigService.getConfig(data.averageConsumption.series, 'month');
        this.chartConfigService.setAdditionalConfiguration(this.averageConsumptionConfig, data.averageConsumption, true);
        this.chartConfigService.setYaxisStep(this.averageConsumptionConfig, data.averageConsumption.yaxisStep);

        this.capacityUtilizationConfig = this.chartConfigService.getConfig(
          [{ name: 'Average', points: data.capacityUtilization.points }], 'year',
        );
        this.chartConfigService.setConfigurationForCapacityUtilization(this.capacityUtilizationConfig, data.capacityUtilization);
        this.chartConfigService.setYaxisStep(this.capacityUtilizationConfig, data.capacityUtilization.yaxisStep);
      });
  }
}
