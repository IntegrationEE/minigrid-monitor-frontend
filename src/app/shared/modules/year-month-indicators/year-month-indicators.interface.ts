import { ColumnType } from '@shared/enums';
import { IBase } from '@shared/interfaces';

export interface IYearMonthIndicatorColumn {
  name: string;
  searchable?: boolean;
  sortable?: boolean;
  editable?: boolean;
  title?: string;
  type: ColumnType;
}

export interface IYearMonthIndicatorConfig {
  url: string;
  columns: IYearMonthIndicatorColumn[];
  isCreateAction: boolean;
}

export interface IYearMonthIndicator extends IBase {
  year: number;
  month: number;

  active?: boolean;
  previousData?: IYearMonthIndicator;
  isNewRow?: boolean;
}

export interface IYearMonthIndicatorOutliers {
  month: number;
  year: number;
  properties: string[];
}

export interface IYearMonthIndicatorValidation {
  isValid: boolean;
  outliers: IYearMonthIndicatorOutliers;
}
