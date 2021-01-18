import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utils } from '@core/providers';
import { CustomCookieService } from '@core/services';
import { environment } from '@env/environment';
import { SettingsCode } from '@shared/enums';
import { CurrentSiteService } from '@sites/site-management/site-management.service';
import { AppConst } from 'app/app.const';
import { isDate } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SocialIndicatorsConst } from './social-indicators.const';
import { SocialIndicatorAction, SocialIndicatorType } from './social-indicators.enum';
import { ISiteVisit, ISocialIndicatorTopicControl } from './social-indicators.interface';

@Injectable()
export class SocialIndicatorsService<T extends ISiteVisit> {
  private saveAction: BehaviorSubject<SocialIndicatorAction> = new BehaviorSubject(null);
  private visitedList: BehaviorSubject<ISiteVisit[]> = new BehaviorSubject([]);
  private baseUrl: string = `${environment.apiUrl}`;

  constructor(private http: HttpClient,
              private customCookieService: CustomCookieService,
              private currentSiteService: CurrentSiteService,
              private utils: Utils) {
  }

  getVisits(url: string): Observable<ISiteVisit[]> {
    return this.http.get<ISiteVisit[]>(`${this.baseUrl}${url}/${this.currentSiteService.getId()}`)
      .pipe(tap((response: ISiteVisit[]) => this.visitedList.next(response)));
  }

  get(url: string, visitDate: Date | string): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}/${this.currentSiteService.getId()}`, { visitDate });
  }

  save(url: string, data: T): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${url}/${this.currentSiteService.getId()}`, data);
  }

  setSaveAction(value: SocialIndicatorAction) {
    this.saveAction.next(value);
  }

  checkSaveAction(): Observable<SocialIndicatorAction> {
    return this.saveAction.asObservable();
  }

  checIfExistsVisit(date: Date | string): boolean {
    return this.visitedList.value.some((item: ISiteVisit) => {
      return isDate(date) ? item.visitDate === date : this.utils.getUtcDate(new Date(item.visitDate)) === date;
    });
  }

  getConfig(topic: SocialIndicatorType): ISocialIndicatorTopicControl[] {
    let controls: ISocialIndicatorTopicControl[];
    const controlsName = SocialIndicatorsConst.CONTROLS;
    const labels = SocialIndicatorsConst.LABELS;
    const tooltips = SocialIndicatorsConst.TOOLTIPS;
    const placeholders = SocialIndicatorsConst.PLACEHOLDERS;

    switch (topic) {
      case SocialIndicatorType.CONNECTIONS:
        controls = [
          {
            name: controlsName.RESIDENTIAL_CONNECTIONS,
            label: labels.RESIDENTIAL_CONNECTIONS,
            placeholder: placeholders.CONNECTIONS,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.RESIDENTIAL_CONNECTIONS,
          },
          {
            name: controlsName.COMMERCIAL_CONNECTIONS,
            label: labels.COMMERCIAL_CONNECTIONS,
            placeholder: placeholders.CONNECTIONS,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.COMMERCIAL_CONNECTIONS,
          },
          {
            name: controlsName.PRODUCTIVE_CONNECTIONS,
            label: labels.PRODUCTIVE_CONNECTIONS,
            placeholder: placeholders.CONNECTIONS,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.PRODUCTIVE_CONNECTIONS,
          },
          {
            name: controlsName.PUBLIC_CONNECTIONS,
            label: labels.PUBLIC_CONNECTIONS,
            placeholder: placeholders.CONNECTIONS,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.PUBLIC_CONNECTIONS,
          },
        ];
        break;
      case SocialIndicatorType.CUSTOMER_SATISFACTIONS:
        controls = [
          {
            name: controlsName.VERY_SATISFIED,
            label: labels.VERY_SATISFIED,
            placeholder: placeholders.CUSTOMER_SATISFACTION,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.VERY_SATISFIED,
          },
          {
            name: controlsName.SOMEHOW_SATISFIED,
            label: labels.SOMEHOW_SATISFIED,
            placeholder: placeholders.CUSTOMER_SATISFACTION,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.SOMEHOW_SATISFIED,
          },
          {
            name: controlsName.VERY_UNSATISFIED,
            label: labels.VERY_UNSATISFIED,
            placeholder: placeholders.CUSTOMER_SATISFACTION,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.VERY_UNSATISFIED,
          },
          {
            name: controlsName.SOMEHOW_UNSATISFIED,
            label: labels.SOMEHOW_UNSATISFIED,
            placeholder: placeholders.CUSTOMER_SATISFACTION,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.SOMEHOW_UNSATISFIED,
          },
          {
            name: controlsName.NEITHER_SATISFIED_NOR_UNSATISFIED,
            label: labels.NEITHER_SATISFIED_NOR_UNSATISFIED,
            placeholder: placeholders.CUSTOMER_SATISFACTION,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.NEITHER_SATISFIED_NOR_UNSATISFIED,
          },
        ];
        break;
      case SocialIndicatorType.EMPLOYMENTS:
        controls = [
          {
            name: controlsName.DIRECT_EMPLOYMENT,
            label: labels.DIRECT_EMPLOYMENT,
            placeholder: placeholders.EMPLOYMENT,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.DIRECT_EMPLOYMENT,
          },
          {
            name: controlsName.INDIRECT_EMPLOYMENT,
            label: labels.INDIRECT_EMPLOYMENT,
            placeholder: placeholders.EMPLOYMENT,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.INDIRECT_EMPLOYMENT,
          },
        ];
        break;
      case SocialIndicatorType.SERVICES:
        controls = [
          {
            name: controlsName.COMMERCIAL_SERVICES,
            label: labels.COMMERCIAL_SERVICES,
            placeholder: placeholders.SERVICES,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.COMMERCIAL_SERVICES,
          },
          {
            name: controlsName.PRODUCTIVE_SERVICES,
            label: labels.PRODUCTIVE_SERVICES,
            placeholder: placeholders.SERVICES,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.PRODUCTIVE_SERVICES,
          },
          {
            name: controlsName.HEALTH_SERVICES,
            label: labels.HEALTH_SERVICES,
            placeholder: placeholders.SERVICES,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.HEALTH_SERVICES,
          },
          {
            name: controlsName.EDUCATION_SERVICES,
            label: labels.EDUCATION_SERVICES,
            placeholder: placeholders.SERVICES,
            regExp: AppConst.REG_EXP.ONLY_NUMBERS,
            tooltip: tooltips.EDUCATION_SERVICES,
          },
        ];
        break;
      case SocialIndicatorType.TARIFF:
        const placeholderTariff: string = placeholders.TARFIFF + this.customCookieService.get(SettingsCode[SettingsCode.CURRENCY]);

        controls = [
          {
            name: controlsName.RESIDENTIAL_TARFIFF,
            label: labels.RESIDENTIAL_TARFIFF,
            placeholder: placeholderTariff,
            regExp: AppConst.REG_EXP.DECIMAL_NUMBERS,
            tooltip: tooltips.RESIDENTIAL_TARFIFF,
          },
          {
            name: controlsName.COMMERCIAL_TARFIFF,
            label: labels.COMMERCIAL_TARFIFF,
            placeholder: placeholderTariff,
            regExp: AppConst.REG_EXP.DECIMAL_NUMBERS,
            tooltip: tooltips.COMMERCIAL_TARFIFF,
          },
          {
            name: controlsName.PRODUCTIVE_TARFIFF,
            label: labels.PRODUCTIVE_TARFIFF,
            placeholder: placeholderTariff,
            regExp: AppConst.REG_EXP.DECIMAL_NUMBERS,
            tooltip: tooltips.PRODUCTIVE_TARFIFF,
          },
          {
            name: controlsName.PUBLIC_TARFIFF,
            label: labels.PUBLIC_TARFIFF,
            placeholder: placeholderTariff,
            regExp: AppConst.REG_EXP.DECIMAL_NUMBERS,
            tooltip: tooltips.PUBLIC_TARFIFF,
          },
        ];
        break;
    }

    return controls;
  }
}
