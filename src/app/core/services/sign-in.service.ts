import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { IAuth, ILogin, ILoginAuth, ILoginBase } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';
import * as Encryptor from 'sha256';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  readonly REQUEST_URL = AppConst.REQUESTS_URL;
  private baseURL: string = environment.baseUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  constructor(private http: HttpClient) { }

  authentication(login: ILogin, isGuest: boolean = false): Observable<IAuth> {
    this.appendConstants(login);
    if (isGuest) {
      login.grant_type = AppConst.AUTH.grant_type_custom;
      login.guest_secret = environment.guest_secret;
    } else {
      login.grant_type = AppConst.AUTH.grant_type;
    }
    const searchParams: string = this.encodeParams(login);

    return this.http.post<IAuth>(this.baseURL + this.REQUEST_URL.CONNECT_TOKEN, searchParams, this.httpOptions);
  }

  reAuth(refreshToken: string): Observable<IAuth> {
    const auth: ILoginAuth = {} as ILoginAuth;

    this.appendConstants(auth);
    auth.grant_type = AppConst.AUTH.grant_type_refresh;
    auth.refresh_token = refreshToken;

    const searchParams: string = this.encodeParams(auth);

    return this.http.post<IAuth>(this.baseURL + this.REQUEST_URL.CONNECT_TOKEN, searchParams, this.httpOptions);
  }

  hashPassword(password: string): string {
    return Encryptor(password);
  }

  private encodeParams(login: ILoginBase): string {
    return Object.keys(login).map((key: string) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(login[key]);
    }).join('&');
  }

  private appendConstants(login: ILoginBase) {
    login.client_id = AppConst.AUTH.client_id;
    login.scope = AppConst.AUTH.scope;
  }
}
