import { Injectable } from '@angular/core';
import { IChartConfig, IPoint } from '@shared/modules';
import { ChartDataSets, ChartTooltipItem } from 'chart.js';

import { BaseChartConfig } from './base-chart-config';

@Injectable()
export class DoughnutChartConfigService extends BaseChartConfig {

  getConfig(points: IPoint[]): IChartConfig {
    const config: IChartConfig = this.getBaseConfig('doughnut');

    this.setColors(config);
    this.setTooltip(config);

    this.setPoints(config, points);

    return config;
  }

  setColors(config: IChartConfig) {
    this.colors.forEach((colour: string, index: number) => {
      if (index === 0) {
        config.colors[0] = { backgroundColor: [] };
      }

      (config.colors[0].backgroundColor as string[]).push(colour);
    });
  }

  setPoints(config: IChartConfig, points: IPoint[], index: number = 0) {
    if (points) {
      points.forEach((point: IPoint) => {
        config.datasets[index].label = `${point.key}`;
        config.datasets[index].data.push(point.value);
        config.labels.push(`${point.key}`);
      });
    }
  }

  private setTooltip(config: IChartConfig) {
    config.options.tooltips = {
      callbacks: {
        label(tooltipItem: ChartTooltipItem, data: IChartConfig) {
          const dataset: ChartDataSets = data.datasets[tooltipItem.datasetIndex];

          return ` ${data.labels[tooltipItem.index]}: ${dataset.data[tooltipItem.index]}%`;
        },
        title() {
          return '';
        },
      },
    };
  }
}
