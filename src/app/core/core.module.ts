import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import * as Interceptors from './interceptors';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [
    DatePipe,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptors.AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptors.ErrorHandlerInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule { }
