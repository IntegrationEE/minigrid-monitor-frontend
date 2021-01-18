import { Injectable } from '@angular/core';
import { SettingsCode } from '@shared/enums';
import { IAuth, ISettings } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomCookieService {
  private changedAuth: BehaviorSubject<unknown> = new BehaviorSubject(null);

  constructor(private cookieService: CookieService) { }

  storeAuth(auth: IAuth) {
    Object.keys(auth).map((key: string) => {
      this.cookieService.set(key, auth[key], null, null, null, null, 'Lax');
    });
  }

  storeSettings(settings: ISettings[]) {
    settings.forEach((setting: ISettings) => {
      this.cookieService.set(SettingsCode[setting.code], setting.value, null, null, null, null, 'Lax');
    });
  }

  deleteAll() {
    this.delete(AppConst.TOKEN.KEY);
    this.delete(AppConst.TOKEN.EXPIRES);
    this.delete(AppConst.TOKEN.TYPE);
    this.delete(AppConst.TOKEN.REFRESH);
    this.delete(SettingsCode[SettingsCode.ADMINISTRATIVE_UNIT_LABEL]);
    this.delete(SettingsCode[SettingsCode.CENTER_POINT]);
    this.delete(SettingsCode[SettingsCode.CURRENCY]);
    this.delete(SettingsCode[SettingsCode.LGA_LABEL]);
    this.delete(SettingsCode[SettingsCode.ORGANISATION_LABEL]);
    this.delete(SettingsCode[SettingsCode.SHOW_DAILY_PROFILE]);

    this.changedAuth.next(null);
  }

  get(key: string): string {
    return this.cookieService.get(key);
  }

  check(key: string): boolean {
    return this.cookieService.check(key);
  }

  setAuthChanged() {
    this.changedAuth.next(null);
  }

  authChanged(): Observable<unknown> {
    return this.changedAuth.asObservable();
  }

  private delete(key: string) {
    this.cookieService.delete(key, null, null, null, 'Lax');
  }
}
