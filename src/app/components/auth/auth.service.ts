import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISetPassword } from '@auth/set-password';
import { SignInService } from '@core/services';
import { environment } from '@env/environment';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ISignUp } from './sign-up';
import { IFirstSignIn } from './welcome-page';

@Injectable()
export class AuthService {
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.ACCOUNTS}/`;
  private registeredUser: BehaviorSubject<ISignUp> = new BehaviorSubject(null);
  constructor(private http: HttpClient,
              private signInService: SignInService) {
  }

  resetPassword(data: ISetPassword): Observable<HttpResponse<unknown>> {
    return this.http.post<HttpResponse<unknown>>(`${this.baseUrl}${AppConst.REQUESTS_URL.RESET_PASSWORD}`, data);
  }

  forgotPassword(email: string): Observable<HttpResponse<unknown>> {
    return this.http.post<HttpResponse<unknown>>(`${this.baseUrl}${AppConst.REQUESTS_URL.FORGOT_PASSWORD}`, {
      email,
      baseUrl: `${this.getBaseUrl()}${AppConst.MAIN_ROUTES.RESET_PASSWORD}`,
    });
  }

  register(data: ISignUp): Observable<HttpResponse<unknown>> {
    data.baseUrl = `${this.getBaseUrl()}${AppConst.MAIN_ROUTES.CONFIRM_EMAIL}`;
    data.password = this.signInService.hashPassword(data.password);

    return this.http.post<HttpResponse<unknown>>(`${this.baseUrl}${AppConst.REQUESTS_URL.REGISTER}`, data)
      .pipe(tap(() => this.registeredUser.next(data)));
  }

  confirmEmail(token: string): Observable<HttpResponse<unknown>> {
    return this.http.post<HttpResponse<unknown>>(`${this.baseUrl}${AppConst.REQUESTS_URL.CONFIRM_EMAIL}`, { emailToken: token });
  }

  sendEmailAgain(data: ISignUp): Observable<HttpResponse<unknown>> {
    return this.http.post<HttpResponse<unknown>>(`${this.baseUrl}${AppConst.REQUESTS_URL.RESEND_EMAIL}`, data);
  }

  setUserDetails(data: IFirstSignIn): Observable<HttpResponse<unknown>> {
    return this.http.post<HttpResponse<unknown>>(`${this.baseUrl}${AppConst.REQUESTS_URL.DETAILS}`, data);
  }

  getRegisteredUser(): ISignUp {
    return this.registeredUser.getValue();
  }

  private getBaseUrl(): string {
    return `${window.location.origin}/#/${AppConst.MAIN_ROUTES.AUTH}/`;
  }
}
