import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utils } from '@core/providers';
import { environment } from '@env/environment';
import { IFilter } from '@shared/interfaces';
import { IChartConfig, IPoint } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { ChartDataSets, ChartTooltipItem } from 'chart.js';
import { Observable } from 'rxjs';

import { IGraphResponse } from './graph';
import { IChart } from './overview.interface';
import { IPortfolioCharts } from './portfolio/portfolio.interface';

@Injectable()
export class OverviewService<T extends IChart> {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.OVERVIEW}`;

  constructor(private http: HttpClient,
              private utils: Utils) {
  }

  getGraph(siteId: number): Observable<IGraphResponse> {
    return this.http.get<IGraphResponse>(`${this.baseUrl}/${siteId}/${AppConst.REQUESTS_URL.SITES}`);
  }

  getPortfolioCharts(filters: IFilter): Observable<IPortfolioCharts> {
    return this.http.post<IPortfolioCharts>(this.baseUrl, this.utils.clearRequest(filters));
  }

  getProgrammeCharts(programmeId: number): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${programmeId}/${AppConst.REQUESTS_URL.PROGRAMMES}`);
  }

  setChartConfig(chart: T) {
    if (!chart) {
      return;
    }

    chart.chartConfig = {
      colors: [{
        backgroundColor: [],
        pointHoverBackgroundColor: AppConst.CHART_COLORS.GREY_DARK,
        pointRadius: 4,
      }],
      datasets: [{
        data: [],
        fill: false,
        lineTension: 0,
      }],
      legend: false,
      chartType: 'line',
      labels: [],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              fontFamily: 'Source Sans Pro',
              fontSize: 16,
              fontColor: AppConst.CHART_COLORS.GREY,
            },
          }],
          yAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              fontColor: AppConst.CHART_COLORS.WHITE,
            },
          }],
        },
        tooltips: {
          callbacks: {
            label(tooltipItem: ChartTooltipItem, data: IChartConfig) {
              const dataset: ChartDataSets = data.datasets[tooltipItem.datasetIndex];

              return ` ${data.labels[tooltipItem.index]}: ${dataset.data[tooltipItem.index]}`;
            },
            title() {
              return '';
            },
          },
        },
        annotation: { annotations: [] },
        legend: {},
      },
    };

    if (chart.points.length) {
      chart.points.forEach((point: IPoint, index: number) => {
        const pointColor: string = index < chart.points.length - 1 ? AppConst.CHART_COLORS.GREY : AppConst.CHART_COLORS.GREEN;

        chart.chartConfig.datasets[0].data.push(point.value);
        (chart.chartConfig.colors[0].backgroundColor as string[]).push(pointColor);
        chart.chartConfig.labels.push(point.key.toString());
      });
    }
  }
}
