import { IChart } from '../overview.interface';

export interface IProgrammeIndicatorChart extends IChart {
  description: string;
  target: string;
  unitOfMeasure: string;
  title: string;
  key: number;
}
