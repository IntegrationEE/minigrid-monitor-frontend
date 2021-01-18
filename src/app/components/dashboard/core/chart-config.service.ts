import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { IChartConfig, IChartMetadata, IPoint, ISeries } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { ChartDataSets, ChartPoint, ChartTooltipItem, TimeUnit } from 'chart.js';
import * as moment from 'moment';

import { BaseChartConfig } from './base-chart-config';

@Injectable()
export class ChartConfigService extends BaseChartConfig {
  getConfig(series: ISeries[], timeUnit: TimeUnit = 'year'): IChartConfig {
    const config: IChartConfig = this.getBaseConfig(this.getChartType(series, timeUnit));

    this.setScales(config);
    this.setColors(config);
    this.setTooltip(config, null, timeUnit);
    if (config.chartType === 'line') {
      this.setTimeAxes(config, timeUnit);
    }
    this.setPadding(config);

    this.setSeries(config, series);

    return config;
  }

  getHorizontalConfig(points: IPoint[]) {
    const config: IChartConfig = this.getBaseConfig('horizontalBar');

    this.setScales(config);
    this.setColors(config);

    config.options.legend.display = points.length > 0;
    config.options.legend.position = 'bottom';
    config.options.scales.yAxes[0].gridLines.display = false;
    config.options.scales.xAxes[0].gridLines.display = false;
    config.options.scales.xAxes[0].position = 'bottom';
    config.options.scales.xAxes[0].ticks.stepSize = 50;
    config.options.scales.xAxes[0].ticks.callback = (value: number) => {
      return value + ' %';
    };

    config.options.tooltips = {
      callbacks: {
        label(tooltipItem: ChartTooltipItem, data: IChartConfig) {
          const dataset: ChartDataSets = data.datasets[tooltipItem.datasetIndex];

          return ` ${dataset.label}: ${dataset.data[tooltipItem.index]}%`;
        },
        title() {
          return '';
        },
      },
    };

    this.setHorizontalChartPoints(config, points);

    return config;
  }

  getLineFilledConfig(series: ISeries[], timeUnit: TimeUnit): IChartConfig {
    const config: IChartConfig = this.getBaseConfig('line');

    this.setScales(config);
    this.setColors(config);
    this.setTimeAxes(config, timeUnit);
    this.setPadding(config);

    if (series) {
      series.forEach((items: ISeries, index: number) => {
        config.datasets[index] = {
          data: [],
          label: items.name,
          fill: true,
        } as ChartDataSets;

        items.points.forEach((point: IPoint) => {
          (config.datasets[index].data as ChartPoint[]).push({ x: new Date(point.key), y: point.value } as ChartPoint);
          config.labels.push(point.key.toString());
        });
      });
    }

    config.options.scales.yAxes[0].stacked = true;

    if (timeUnit === 'year') {
      config.options.scales.yAxes[0].ticks.stepSize = 50;
      config.options.scales.yAxes[0].scaleLabel.labelString = '%';
      config.colors[0].backgroundColor = AppConst.CHART_COLORS.LIMONE;

      this.setTooltip(config, '%', 'month');
    } else {
      this.setTooltip(config, null, timeUnit);
    }

    return config;
  }

  setAdditionalConfiguration(config: IChartConfig, data: IChartMetadata, showUnitOfMeasure: boolean = true) {
    if (showUnitOfMeasure) {
      config.options.scales.yAxes[0].scaleLabel.labelString = data.unitOfMeasure;
    }
    config.title = data.title;
    config.tooltip = data.tooltip;
    if (config.chartType !== 'horizontalBar') {
      config.legend = config.labels.length > 0;
    }
  }

  setConfigurationForCapacityUtilization(config: IChartConfig, data: IChartMetadata) {
    this.setTimeAxes(config, 'year');
    this.setTooltip(config, '%', 'month');
    this.setAdditionalConfiguration(config, data);
  }

  setYaxisStep(config: IChartConfig, stepSize: number) {
    config.options.scales.yAxes[0].ticks.stepSize = stepSize;
  }

  private setTimeAxes(config: IChartConfig, timeUnit: TimeUnit) {
    config.options.scales.xAxes[0].type = 'time';
    config.options.scales.xAxes[0].time = {
      unit: timeUnit,
      stepSize: 1,
    };

    if (timeUnit === 'month') {
      config.options.scales.xAxes[0].ticks.minRotation = 45;
      config.options.scales.xAxes[0].ticks.maxRotation = 45;
      config.options.scales.xAxes[0].time.displayFormats = {
        year: '',
        month: 'MMM',
      };
    }
  }

  private setPadding(config: IChartConfig) {
    config.options.layout = {
      padding: {
        top: 10,
        bottom: -25,
      },
    };
  }

  private setColors(config: IChartConfig) {
    this.colors.forEach((colour: string) => {
      config.colors.push({
        borderColor: colour,
        backgroundColor: colour,
        pointHoverBackgroundColor: AppConst.CHART_COLORS.GREY,
      });
    });
  }

  private getChartType(series: ISeries[], timeUnit: TimeUnit = 'year'): 'bar' | 'line' {
    const dataTable: string[] = [];

    series.forEach((items: ISeries) => {
      if (items.points) {
        items.points.forEach((point: IPoint) => {
          if (point.value > 0) {
            let date: string;

            switch (timeUnit) {
              case 'year':
                date = moment(point.key).format('YYYY');
                break;
              case 'month':
                date = moment(point.key).format('YYYY-MM-DD');
                break;
              case 'hour':
                date = moment(point.key).format('HH');
                break;
            }

            if (!dataTable.includes(date)) {
              dataTable.push(date);
            }
          }
        });
      }
    });

    return dataTable.length > 4 ? 'line' : 'bar';
  }

  private setTooltip(config: IChartConfig, unitOfMeasure: string = '', timeunit: TimeUnit) {
    config.options.tooltips = {
      callbacks: {
        label(tooltipItem: ChartTooltipItem, data: IChartConfig) {
          const datePipe: DatePipe = new DatePipe('en-GB');
          const dataset: ChartDataSets = data.datasets[tooltipItem.datasetIndex];
          const point: ChartPoint = dataset.data[tooltipItem.index] as ChartPoint;
          let date: string;

          switch (timeunit) {
            case 'year':
              date = `${new Date(point.x as Date).getFullYear()}`;
              break;
            case 'month':
              date = `${datePipe.transform(point.x as Date, 'MMM yyyy')}`;
              break;
            case 'hour':
              date = `${datePipe.transform(point.x as Date, 'HH:mm')}`;
              break;
          }

          return `${dataset.label} (${date}): ${point.y}${unitOfMeasure ? unitOfMeasure : ''}`;
        },
        title() {
          return '';
        },
      },
    };
  }

  private setScales(config: IChartConfig) {
    config.options.scales = {
      xAxes: [{
        offset: config.chartType === 'bar',
        gridLines: {
          color: AppConst.CHART_COLORS.WHITE,
          zeroLineColor: AppConst.CHART_COLORS.GREY,
          zeroLineWidth: 0,
        },
        ticks: {
          fontFamily: 'Source Sans Pro',
          fontSize: 16,
          fontColor: AppConst.CHART_COLORS.GREY,
          beginAtZero: true,
        },
        scaleLabel: {
          fontFamily: 'Source Sans Pro',
          fontSize: 18,
          fontColor: AppConst.CHART_COLORS.GREY,
          display: true,
        },
      }],
      yAxes: [{
        gridLines: {
          color: AppConst.CHART_COLORS.WHITE,
          zeroLineColor: AppConst.CHART_COLORS.GREY,
          zeroLineWidth: 1,
        },
        ticks: {
          fontFamily: 'Source Sans Pro',
          fontSize: 16,
          fontColor: AppConst.CHART_COLORS.GREY,
          beginAtZero: true,
        },
        scaleLabel: {
          fontFamily: 'Source Sans Pro',
          fontSize: 18,
          fontColor: AppConst.CHART_COLORS.GREY,
          display: true,
        },
      }],
    };
  }

  private setHorizontalChartPoints(config: IChartConfig, points: IPoint[]) {
    points.forEach((point: IPoint, index: number) => {
      config.datasets[index] = {
        data: [point.value],
        label: point.key,
        fill: true,
        stack: config.chartType,
      } as ChartDataSets;
    });
  }
}
