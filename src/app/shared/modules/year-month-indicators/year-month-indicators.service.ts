import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomCookieService } from '@core/services';
import { environment } from '@env/environment';
import { ColumnType, SettingsCode, YearMonthIndicatorType } from '@shared/enums';
import { IYearMonthIndicatorOption } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';

import { IYearMonthIndicatorsUploadResponse } from './year-month-indicators-upload/year-month-indicators-upload.interface';
import { YearMonthIndicatorTableConst } from './year-month-indicators.const';
import {
  IYearMonthIndicator,
  IYearMonthIndicatorColumn,
  IYearMonthIndicatorConfig,
  IYearMonthIndicatorValidation,
} from './year-month-indicators.interface';

@Injectable()
export class YearMonthIndicatorsService<T extends IYearMonthIndicator> {
  private baseUrl: string = environment.apiUrl;
  private optionId: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(private http: HttpClient,
              private customCookieService: CustomCookieService) {
  }

  getData(url: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}${url}/${this.getOptionId()}`);
  }

  create(url: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}/${this.getOptionId()}`, data);
  }

  validate(url: string, data: T): Observable<IYearMonthIndicatorValidation> {
    return this.http.patch<IYearMonthIndicatorValidation>(
      `${this.baseUrl}${url}/${this.getOptionId()}/${AppConst.REQUESTS_URL.VALIDATE}`, data);
  }

  update(url: string, id: number, data: T): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${url}/${id}`, data);
  }

  upload(url: string, item: FormData): Observable<IYearMonthIndicatorsUploadResponse> {
    return this.http.post<IYearMonthIndicatorsUploadResponse>(
      `${this.baseUrl}${url}/${this.getOptionId()}/${AppConst.REQUESTS_URL.UPLOAD}`, item, this.prepareHeadersForUpload());
  }

  getConfig(topic: IYearMonthIndicatorOption): IYearMonthIndicatorConfig {
    let columns: IYearMonthIndicatorColumn[];
    const titles = YearMonthIndicatorTableConst.TITLE;
    const currency: string = ' [' + this.customCookieService.get(SettingsCode[SettingsCode.CURRENCY]) + ']';

    switch (topic.type) {
      case YearMonthIndicatorType.PROGRAMME:
        columns = [
          { name: YearMonthIndicatorTableConst.COMMON.YEAR, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.COMMON.MONTH, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.PROGRAMME.VALUE, editable: true, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.COMMON.ACTIONS, type: ColumnType.ACTIONS },
        ];
        break;
      case YearMonthIndicatorType.CONSUMPTION:
        const consumptionColumns = YearMonthIndicatorTableConst.CONSUMPTIONS;

        columns = [
          { name: YearMonthIndicatorTableConst.COMMON.YEAR, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.COMMON.MONTH, type: ColumnType.GENERIC },
          { name: consumptionColumns.RESIDENTIAL, title: titles.CONSUMPTIONS_RESIDENTIAL, editable: true, type: ColumnType.GENERIC },
          { name: consumptionColumns.COMMERCIAL, title: titles.CONSUMPTIONS_COMMERCIAL, editable: true, type: ColumnType.GENERIC },
          { name: consumptionColumns.PRODUCTIVE, title: titles.CONSUMPTIONS_PRODUCTIVE, editable: true, type: ColumnType.GENERIC },
          { name: consumptionColumns.PUBLIC, title: titles.CONSUMPTIONS_PUBLIC, editable: true, type: ColumnType.GENERIC },
          { name: consumptionColumns.PEAK_LOAD, title: titles.CONSUMPTIONS_PEAK_LOAD, editable: true, type: ColumnType.GENERIC },
          { name: consumptionColumns.TOTAL, title: titles.CONSUMPTIONS_TOTAL, editable: true, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.COMMON.ACTIONS, type: ColumnType.ACTIONS },
        ];
        break;
      case YearMonthIndicatorType.OPEX:
        const opexColumns = YearMonthIndicatorTableConst.OPEX;

        columns = [
          { name: YearMonthIndicatorTableConst.COMMON.YEAR, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.COMMON.MONTH, type: ColumnType.GENERIC },
          { name: opexColumns.SITE_SPECIFIC, title: titles.OPEX_SITE_SPECIFIC + currency, editable: true, type: ColumnType.GENERIC },
          { name: opexColumns.COMPANY_LEVEL, title: titles.OPEX_COMPANY_LEVEL + currency, editable: true, type: ColumnType.GENERIC },
          { name: opexColumns.TAXES, title: titles.OPEX_TAXES + currency, editable: true, type: ColumnType.GENERIC },
          { name: opexColumns.LOAN_REPAYMENTS, title: titles.OPEX_LOAN_REPAYMENTS + currency, editable: true, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.COMMON.ACTIONS, type: ColumnType.ACTIONS },
        ];
        break;
      case YearMonthIndicatorType.REVENUE:
        const revenueColumns = YearMonthIndicatorTableConst.REVENUE;

        columns = [
          { name: YearMonthIndicatorTableConst.COMMON.YEAR, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.COMMON.MONTH, type: ColumnType.GENERIC },
          { name: revenueColumns.RESIDENTIAL, title: titles.REVENUE_RESIDENTIAL + currency, editable: true, type: ColumnType.GENERIC },
          { name: revenueColumns.COMMERCIAL, title: titles.REVENUE_COMMERCIAL + currency, editable: true, type: ColumnType.GENERIC },
          { name: revenueColumns.PRODUCTIVE, title: titles.REVENUE_PRODUCTIVE + currency, editable: true, type: ColumnType.GENERIC },
          { name: revenueColumns.PUBLIC, title: titles.REVENUE_PUBLIC + currency, editable: true, type: ColumnType.GENERIC },
          { name: YearMonthIndicatorTableConst.COMMON.ACTIONS, type: ColumnType.ACTIONS },
        ];
        break;
    }

    return {
      url: topic.url,
      columns,
      isCreateAction: topic.type === YearMonthIndicatorType.PROGRAMME,
    };
  }

  getOptionId(): number {
    return this.optionId.value ? this.optionId.value : null;
  }

  setOptionId(id: number) {
    this.optionId.next(id);
  }

  private prepareHeadersForUpload(): unknown {
    return {
      reportProgress: true,
      headers: new HttpHeaders({ ['fileUpload']: 'true' }),
    };
  }
}
