import { DatasetColor } from '@rinminase/ng-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';

export interface IChartConfig {
  datasets: ChartDataSets[];
  colors: DatasetColor[];
  legend: boolean;
  chartType: 'bar' | 'horizontalBar' | 'line' | 'doughnut';
  labels: string[];
  options: (ChartOptions & { annotation: any });
  plugins?: Chart.PluginServiceRegistrationOptions[];
  tooltip?: string;
  title?: string;
}

export interface ISeries {
  name: string;
  points: IPoint[];
}

export interface IPoint {
  key: number | string | Date;
  value: number;
}

export interface IChartInsideText {
  title: string;
  subtitle: string;
}

export interface IChartMetadata {
  unitOfMeasure: string;
  title?: string;
  tooltip?: string;
  yaxisStep?: number;
  series?: ISeries[];
  points?: IPoint[];
}
