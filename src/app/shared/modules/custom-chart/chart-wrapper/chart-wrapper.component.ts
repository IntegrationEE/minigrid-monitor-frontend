import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PluginServiceGlobalRegistrationAndOptions } from '@rinminase/ng-charts';
import { FileFormat } from '@shared/enums';
import { AppConst } from 'app/app.const';

import { ChartMode } from '../custom-chart.enum';
import { IChartConfig, IChartInsideText } from '../custom-chart.interface';

@Component({
  selector: 'app-chart-wrapper',
  templateUrl: './chart-wrapper.component.html',
  styleUrls: ['./chart-wrapper.component.scss'],
})
export class ChartWrapperComponent {
  @Input() mode: ChartMode;
  @Input() set config(configChart: IChartConfig) {
    if (configChart) {
      this.configChart = configChart;
      this.isOnlyOnePoint = configChart.labels.length === 1;
      if (configChart.title) {
        this.title = configChart.title;
      }
      if (configChart.tooltip) {
        this.tooltip = configChart.tooltip;
      }
    }
  }
  @Input() set setTarget(target: number) {
    this.target = target;
    this.isTargetAchieved = (this.configChart.datasets[0].data as number[]).some((item: number) => target <= item);
    this.configChart.options.annotation.annotations[0].label.yAdjust = this.isTargetAchieved ? -10 : 10;
  }
  @Input() title: string;
  @Input() tooltip: string;
  @Input() value: number;
  @Input() set setTrend(trend: number) {
    this.trend = trend;
    switch (true) {
      case (this.trend > 0):
        this.iconUrl = AppConst.ICONS.arrowUp;
        break;
      case (this.trend === 0):
        this.iconUrl = AppConst.ICONS.arrowRight;
        break;
      case (this.trend < 0):
        this.iconUrl = AppConst.ICONS.arrowDown;
        break;
      default:
        this.iconUrl = '';
        break;
    }
  }
  @Input() unitOfMeasure: string;
  @Input() key: number;
  @Input() hideExportMenu: boolean;
  @Input() set setCenterText(text: IChartInsideText) {
    this.plugins.push({
      id: 'centerText',
      beforeDraw: (chart: Chart) => {
        if (chart && chart.config.data.datasets && text) {
          chart.clear();

          if (!(chart.config.data.datasets[0].data as number[]).some((item: number) => item > 0)) {
            return;
          }

          const textX: number = Math.round((chart.width - chart['legend'].width) / 2);
          const textY: number = (chart.height / 2) - 10;

          // title
          chart.ctx.font = `bold 18px Poppins`;
          chart.ctx.fillStyle = AppConst.CHART_COLORS.GREY_DARK;
          chart.ctx.textAlign = 'center';
          chart.ctx.fillText(text.title, textX, textY);
          // subtitle
          chart.ctx.font = `16px Poppins`;
          chart.ctx.fillStyle = AppConst.CHART_COLORS.GREY;
          chart.ctx.textAlign = 'center';
          chart.ctx.fillText(text.subtitle, textX, textY + 20);
        }
      },
    });
  }
  @Output() onExportData: EventEmitter<FileFormat> = new EventEmitter();
  trend: number;
  iconUrl: string = AppConst.ICONS.info;
  checkmarkIconUrl: string = AppConst.ICONS.checkmark;
  plugins: PluginServiceGlobalRegistrationAndOptions[] = [];
  isOnlyOnePoint: boolean;
  isTargetAchieved: boolean;
  target: number;
  configChart: IChartConfig;
  readonly icons = AppConst.ICONS;
  readonly modes: typeof ChartMode = ChartMode;
  readonly fileFormats: typeof FileFormat = FileFormat;

  exportData(format: FileFormat) {
    if (format === this.fileFormats.PNG) {
      // ready solution in the file.service.ts (downloadPNG)
    } else {
      this.onExportData.next(format);
    }
  }
}
