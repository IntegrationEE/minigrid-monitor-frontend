import { IYearMonthIndicatorOption } from './year-month-indicator-option.interface';

export interface IndicatorsOptionValue {
  topic: IYearMonthIndicatorOption;
  value: { optionId: number, commissioningDate: Date };
}
