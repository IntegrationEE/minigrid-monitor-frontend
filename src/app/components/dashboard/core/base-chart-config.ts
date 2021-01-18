import { IChartConfig, IPoint, ISeries } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { ChartDataSets, ChartPoint } from 'chart.js';

export abstract class BaseChartConfig {
  readonly colors: string[] = [
    AppConst.CHART_COLORS.GREEN_LIGHT,
    AppConst.CHART_COLORS.YELLOW_DARK,
    AppConst.CHART_COLORS.GREY_LIGHT,
    AppConst.CHART_COLORS.RED,
    AppConst.CHART_COLORS.GREY_DARK,
    AppConst.CHART_COLORS.ORANGE,
  ];

  getBaseConfig(type: 'bar' | 'horizontalBar' | 'line' | 'doughnut'): IChartConfig {
    const config: IChartConfig = {
      colors: [],
      datasets: [{
        data: [],
        fill: false,
      }],
      legend: true,
      chartType: type,
      labels: [],
      title: '',
      tooltip: '',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {},
        annotation: { annotations: [] },
        legend: {
          position: 'right',
          labels: {
            fontFamily: 'Source Sans Pro',
            fontSize: 14,
            boxWidth: 15,
            fontColor: AppConst.CHART_COLORS.GREY,
          },
        },
      },
    };

    return config;
  }

  setSeries(config: IChartConfig, series: ISeries[]) {
    series.forEach((items: ISeries, index: number) => {
      config.datasets[index] = {
        data: [],
        label: items.name,
        fill: config.chartType !== 'line',
        lineTension: 0,
      } as ChartDataSets;

      if (config.chartType === 'bar') {
        config.datasets[index].stack = config.chartType;
      }

      this.setPoints(config, items.points, index);
    });
  }

  setPoints(config: IChartConfig, points: IPoint[], index: number = 0) {
    if (points) {
      points.forEach((point: IPoint) => {
        const date: Date = new Date(point.key);

        (config.datasets[index].data as ChartPoint[]).push({ x: date, y: point.value } as ChartPoint);
        if (!config.labels.includes(date.getFullYear().toString())) {
          config.labels.push(date.getFullYear().toString());
        }
      });
    }
  }
}
