import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoleCode } from '@shared/enums';
import { IAuthResponse } from '@shared/interfaces';
import { AppConst } from 'app/app.const';

import { CustomCookieService } from './custom-cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private customCookieService: CustomCookieService) { }

  authenticated(): boolean {
    return this.customCookieService.check(AppConst.TOKEN.KEY) && !this.tokenExpired();
  }

  getUserName(): string {
    const tokenPayload: IAuthResponse = this.getToken();

    return tokenPayload.email;
  }

  getUserRole(): RoleCode {
    const tokenPayload: IAuthResponse = this.getToken();

    return RoleCode[tokenPayload.userRole];
  }

  getRefreshToken(): string {
    return this.customCookieService.get(AppConst.TOKEN.REFRESH);
  }

  getUserId(): number {
    const tokenPayload: IAuthResponse = this.getToken();

    return +tokenPayload.userId;
  }

  getCompanyId(): number {
    const tokenPayload: IAuthResponse = this.getToken();

    return tokenPayload.company ? +tokenPayload.company : null;
  }

  isAnonymous(): boolean {
    const tokenPayload: IAuthResponse = this.getToken();

    return JSON.parse(tokenPayload.isAnonymous.toLowerCase());
  }

  isHeadOfCompany(): boolean {
    const tokenPayload: IAuthResponse = this.getToken();

    return JSON.parse(tokenPayload.isHeadOfCompany.toLowerCase());
  }

  tokenExpired(): boolean {
    const token: string = this.customCookieService.get(AppConst.TOKEN.KEY);

    if (token) {
      const tokenPayload: IAuthResponse = this.getToken(token);

      if (tokenPayload.exp < Date.now() / 1000) {
        this.customCookieService.deleteAll();

        return true;
      }

      return false;
    }

    return true;
  }

  isAdmin() {
    return this.checkUserRole(RoleCode.ADMINISTRATOR);
  }

  isDeveloper() {
    return this.checkUserRole(RoleCode.DEVELOPER);
  }

  isGuest() {
    return this.checkUserRole(RoleCode.GUEST);
  }

  isProgrammeManager() {
    return this.checkUserRole(RoleCode.PROGRAMME_MANAGER);
  }

  private checkUserRole(role: RoleCode): boolean {
    return this.authenticated() && this.getUserRole() === role;
  }

  private getToken(token: string = null): IAuthResponse {
    const helper = new JwtHelperService();

    if (token) {
      return helper.decodeToken(token);
    }

    if (this.customCookieService.get(AppConst.TOKEN.KEY)) {
      return helper.decodeToken(this.customCookieService.get(AppConst.TOKEN.KEY));
    }
  }
}
