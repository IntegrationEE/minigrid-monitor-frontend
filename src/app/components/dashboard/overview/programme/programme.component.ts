import { Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartMode } from '@shared/modules';
import { AppConst } from 'app/app.const';
import * as ChartAnnotation from 'chartjs-plugin-annotation';

import { OverviewService } from '../overview.service';

import { IProgrammeIndicatorChart } from './programme.interface';

@UntilDestroy()
@Component({
  selector: 'app-programme',
  templateUrl: './programme.component.html',
})
export class ProgrammeComponent {
  @Input() set setProgrammeId(programmeId: number) {
    if (programmeId) {
      this.fetchData(programmeId);
    }
  }

  model: IProgrammeIndicatorChart[];
  readonly chartMode: ChartMode = ChartMode.PROGRAMME;

  constructor(private overviewService: OverviewService<IProgrammeIndicatorChart>) { }

  private fetchData(programmeId: number) {
    this.overviewService.getProgrammeCharts(programmeId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IProgrammeIndicatorChart[]) => {
        this.model = response;

        this.model.forEach((programmeIndicatorChart: IProgrammeIndicatorChart) => {
          this.overviewService.setChartConfig(programmeIndicatorChart);
          programmeIndicatorChart.chartConfig.plugins = [ChartAnnotation];
          programmeIndicatorChart.chartConfig.options.annotation.annotations = [{
            drawTime: 'afterDatasetsDraw',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: programmeIndicatorChart.target,
            borderColor: AppConst.CHART_COLORS.GREEN_LIGHT,
            borderWidth: 3,
            borderDash: [7, 7],
            label: {
              backgroundColor: AppConst.CHART_COLORS.WHITE,
              content: 'Target ' + programmeIndicatorChart.target + ' ' + programmeIndicatorChart.unitOfMeasure,
              fontColor: AppConst.CHART_COLORS.GREEN_LIGHT,
              position: 'right',
              enabled: true,
              xPadding: 0,
              yPadding: 0,
            },
          }];
        });
      });
  }
}
