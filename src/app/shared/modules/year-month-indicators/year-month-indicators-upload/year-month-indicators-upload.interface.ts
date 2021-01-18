import { IYearMonthIndicatorOutliers } from '../year-month-indicators.interface';

export interface IYearMonthIndicatorsUploadResponse {
  inserted: number;
  updated: number;
  notApplicable: number;
  outliers: IYearMonthIndicatorOutliers[];
}

export interface IYearMonthIndicatorsUpload {
  url: string;
  title: string;
}
