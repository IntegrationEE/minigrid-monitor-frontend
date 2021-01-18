import { Component, Input } from '@angular/core';
import { FileService } from '@core/services';
import { ChartConfigService, DoughnutChartConfigService } from '@dashboard/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileFormat, SocialChartType } from '@shared/enums';
import { IFilter } from '@shared/interfaces';
import { ChartMode, IChartConfig, IChartInsideText } from '@shared/modules';
import { CustomNumberPipe } from '@shared/pipes';
import { AppConst } from 'app/app.const';

import { ISocialData } from '../advanced-analytics.interface';
import { AdvancedAnalyticsService } from '../advanced-analytics.service';

@UntilDestroy()
@Component({
  selector: 'app-social-analytics',
  templateUrl: './social-analytics.component.html',
})
export class SocialAnalyticsComponent {
  @Input() set setFilters(filters: IFilter) {
    this.fetchData(filters);
  }
  peopleConnectedConfig: IChartConfig;
  servicesConfig: IChartConfig;
  employementConfig: IChartConfig;
  customerConfig: IChartConfig;
  satisfactionInfo: IChartInsideText;
  readonly chartMode: ChartMode = ChartMode.ADVANCED;
  readonly chartTypes: typeof SocialChartType = SocialChartType;
  private filters: IFilter;

  constructor(private advancedAnalyticsService: AdvancedAnalyticsService,
              private fileService: FileService,
              private numberPipe: CustomNumberPipe,
              private chartConfigService: ChartConfigService,
              private doughnutChartConfigService: DoughnutChartConfigService) {
  }

  exportData(type: SocialChartType, format: FileFormat) {
    this.fileService.downloadSocial(type, format, this.filters)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private fetchData(filters: IFilter) {
    this.filters = filters;
    this.advancedAnalyticsService.getSocialData(filters)
      .pipe(untilDestroyed(this))
      .subscribe((data: ISocialData) => {
        this.peopleConnectedConfig = this.chartConfigService.getConfig(data.peopleConnected.series);
        this.chartConfigService.setAdditionalConfiguration(this.peopleConnectedConfig, data.peopleConnected, true);
        this.chartConfigService.setYaxisStep(this.peopleConnectedConfig, data.peopleConnected.yaxisStep);

        this.servicesConfig = this.chartConfigService.getConfig(data.newServicesAvailable.series);
        this.chartConfigService.setAdditionalConfiguration(this.servicesConfig, data.newServicesAvailable, true);
        // Color Customizations
        for (let i: number = 0; i < data.newServicesAvailable.series.length; i++) {
          this.customizeColourScheme(data.newServicesAvailable.series[i].name, this.servicesConfig, i);
        }
        this.chartConfigService.setYaxisStep(this.servicesConfig, data.newServicesAvailable.yaxisStep);

        this.employementConfig = this.chartConfigService.getConfig(data.employmentCreated.series);
        this.chartConfigService.setAdditionalConfiguration(this.employementConfig, data.employmentCreated, true);
        this.chartConfigService.setYaxisStep(this.employementConfig, data.employmentCreated.yaxisStep);

        this.customerConfig = this.doughnutChartConfigService.getConfig(data.customerSatisfaction.points);
        this.chartConfigService.setAdditionalConfiguration(this.customerConfig, data.customerSatisfaction, false);
        this.satisfactionInfo = {
          title: this.numberPipe.transform(data.complaints),
          subtitle: 'complaints',
        };
      });
  }

  private customizeColourScheme(seriesName: string, chartConfig: IChartConfig, index: number) {
    switch (seriesName) {
      case 'Education':
        chartConfig.colors[index].borderColor = AppConst.CHART_COLORS.RED;
        chartConfig.colors[index].backgroundColor = AppConst.CHART_COLORS.RED;
        break;

      case 'Health':
        chartConfig.colors[index].borderColor = AppConst.CHART_COLORS.ORANGE;
        chartConfig.colors[index].backgroundColor = AppConst.CHART_COLORS.ORANGE;
        break;

      default:
        break;
    }
  }
}
