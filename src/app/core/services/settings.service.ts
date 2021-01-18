import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { SettingsCode } from '@shared/enums';
import { ILatLong, ISettings } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CustomCookieService } from './custom-cookie.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient, private customCookieService: CustomCookieService) { }

  getSettings(): Observable<ISettings[]> {
    return this.http.get<ISettings[]>(`${environment.apiUrl}${AppConst.REQUESTS_URL.SETTINGS}`)
      .pipe(tap((data: ISettings[]) => {
        this.customCookieService.storeSettings(data);
      }));
  }

  getCenterPoint(): ILatLong {
    const centerPoint: string = this.customCookieService.get(SettingsCode[SettingsCode.CENTER_POINT]);
    const latlong: string[] = centerPoint && centerPoint.split(',');

    return { lat: Number(latlong[0]), long: (Number(latlong[1])) };
  }

  getCurrencyIcon(): string {
    const currency: string = this.customCookieService.get(SettingsCode[SettingsCode.CURRENCY]);

    return `${environment.iconUrl}currency_${currency}.png`;
  }

  getDailyProfile(): boolean {
    const showDailyProfile: string = this.customCookieService.get(SettingsCode[SettingsCode.SHOW_DAILY_PROFILE]);

    return JSON.parse(showDailyProfile.toLowerCase());
  }
}
