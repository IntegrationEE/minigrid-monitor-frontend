import { ChartCode, ConvertableType } from '@shared/enums';

export interface IChartConfiguration {
  id: number;
  code: ChartCode;
  title: string;
  tooltip: string;
  unitOfMeasure: string;
  isCumulative: boolean;
  convertable: ConvertableType;
  name: string;
  typeName: string;
}
