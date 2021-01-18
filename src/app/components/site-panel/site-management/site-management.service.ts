import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { ISite } from '@sites/site-management';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CurrentSiteService {
  private qrCode: BehaviorSubject<Blob> = new BehaviorSubject<Blob>(null);
  private current: BehaviorSubject<ISite> = new BehaviorSubject(null);
  private refreshStatusSub: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient,
              private sanitizer: DomSanitizer) {
  }

  get(id: number): Observable<ISite> {
    return this.http.get<ISite>(`${environment.apiUrl}${AppConst.REQUESTS_URL.SITES}/${id}`)
      .pipe(tap((response: ISite) => this.setValue(response)));
  }

  getQrCode(id: number): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrl}${AppConst.REQUESTS_URL.SITE_QRS}/${id}`, {
      responseType: 'blob' as 'json',
    }).pipe(tap((response: Blob) => this.setQrCodeValue(response)));
  }

  updateQrCode(id: number): Observable<HttpResponse<unknown>> {
    return this.http.patch<HttpResponse<unknown>>(`${environment.apiUrl}${AppConst.REQUESTS_URL.SITE_QRS}/${id}`, {});
  }

  getId(): number {
    return this.current.value ? this.current.value.id : null;
  }

  getValue(): ISite {
    return this.current.value;
  }

  setValue(model: ISite) {
    if (model) {
      model.commissioningDate = new Date(model.commissioningDate);
    }

    this.current.next(model);
  }

  getRefresh(): Observable<boolean> {
    return this.refreshStatusSub.asObservable();
  }

  refreshStatus() {
    this.refreshStatusSub.next(true);
  }

  setQrCodeValue(value: Blob) {
    this.qrCode.next(value);
  }

  getQrCodeValue(): SafeUrl {
    const qrCodeValue: Blob = this.qrCode.getValue();

    if (qrCodeValue) {
      return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(qrCodeValue));
    }
  }
}
