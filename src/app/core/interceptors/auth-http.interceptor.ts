import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { AuthenticateService, CustomCookieService } from '../services';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(private customCookieService: CustomCookieService,
              private authService: AuthenticateService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.authenticated()) {
      return next.handle(this.getAuthorizedRequest(request));
    }

    return next.handle(request);
  }

  private getAuthorizedRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const authorization: string = this.getTokenType() + ' ' + this.getToken();
    const authReq: HttpRequest<unknown> = request.clone({
      setHeaders: {
        'Authorization': authorization,
        'content-Type': 'application/json',
      },
    });

    if (authReq.headers.has('fileUpload')) {
      const headers: HttpHeaders = authReq.headers.delete('fileUpload').delete('content-Type');

      return authReq.clone({ headers });
    }

    return authReq;
  }

  private getToken(): string {
    return this.customCookieService.get(AppConst.TOKEN.KEY);
  }

  private getTokenType(): string {
    return this.customCookieService.get(AppConst.TOKEN.TYPE);
  }
}
