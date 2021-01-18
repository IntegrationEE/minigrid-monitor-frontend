import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgProgress, NgProgressRef } from 'ngx-progressbar';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { MessageHandler } from '../providers';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  progressRef: NgProgressRef;

  constructor(private messageHandler: MessageHandler,
              private progress: NgProgress) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.progressRef = this.progress.ref('progressbar');
    this.progressRef.start();

    return next.handle(request).pipe(
      catchError((data: HttpErrorResponse) => this.handleError(data, request)),
      finalize(() => this.progressRef.complete()),
    );
  }

  private handleError(response: HttpErrorResponse, _: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    this.messageHandler.handleError(response);

    return throwError(response);
  }
}
