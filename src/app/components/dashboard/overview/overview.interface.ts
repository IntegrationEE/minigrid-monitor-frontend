import { IChartConfig, IPoint } from '@shared/modules';

export interface IChart {
  points: IPoint[];
  unitOfMeasure: string;
  value: number;
  chartConfig?: IChartConfig;
  title?: string;
  tooltip?: string;
}
