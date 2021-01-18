import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { domToImage } from '@emmaramirez/dom-to-image';
import { environment } from '@env/environment';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FileFormat, FinancialChartType, SocialChartType, TechnicalChartType, YearMonthIndicatorType } from '@shared/enums';
import { IFilter } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import * as downloadJS from 'downloadjs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.DOCUMENTS}/`;

  constructor(private http: HttpClient) { }

  downloadSocial(type: SocialChartType, format: FileFormat, filters: IFilter): Observable<Blob> {
    return this.getBlob(`${this.baseUrl}${type}/${AppConst.REQUESTS_URL.SOCIAL}/${format}`, filters)
      .pipe(tap((data: Blob) => this.downloadFile(data, SocialChartType[type], format)));
  }

  downloadTechnical(type: TechnicalChartType, format: FileFormat, filters: IFilter): Observable<Blob> {
    return this.getBlob(`${this.baseUrl}${type}/${AppConst.REQUESTS_URL.TECHNICAL}/${format}`, filters)
      .pipe(tap((data: Blob) => this.downloadFile(data, TechnicalChartType[type], format)));
  }

  downloadFinancial(type: FinancialChartType, format: FileFormat, filters: IFilter): Observable<Blob> {
    return this.getBlob(`${this.baseUrl}${type}/${AppConst.REQUESTS_URL.FINANCIAL}/${format}`, filters)
      .pipe(tap((data: Blob) => this.downloadFile(data, FinancialChartType[type], format)));
  }

  downloadYearMonthIndicatos(url: string, siteId: number, type: YearMonthIndicatorType, format: FileFormat): Observable<Blob> {
    return this.getBlob(`${environment.apiUrl}${url}/${siteId}${AppConst.REQUESTS_URL.EXPORT}/${format}`, {})
      .pipe(tap((data: Blob) => this.downloadFile(data, YearMonthIndicatorType[type], format)));
  }

  downloadPNG() {
    const excludeMap: { tagName: string } = document.getElementById('LeafletMap');

    domToImage
      .toJpeg((document.body), {
        quality: 0.95,
        filter: (exclusion: { tagName: string } = excludeMap) => exclusion.tagName !== 'APP-HEADER-MAP',
      })
      .then((dataUrl: string) => {
        const link = document.createElement('a');

        link.download = 'Mini-Grid Monitor.png';
        link.href = dataUrl;
        link.click();
      });
  }

  private getBlob(url: string, data: object): Observable<Blob> {
    return this.http.post<Blob>(`${url}`, data, {
      responseType: 'blob' as 'json',
    });
  }

  private downloadFile(data: Blob, fileName: string, type: FileFormat) {
    switch (type) {
      case FileFormat.CSV:
        fileName = `${fileName}${AppConst.EXTENSIONS.CSV}`;
        downloadJS(data, fileName, AppConst.CONTENT_TYPES.CSV);
        break;
      case FileFormat.XLS:
        fileName = `${fileName}${AppConst.EXTENSIONS.XLS}`;
        downloadJS(data, fileName, AppConst.CONTENT_TYPES.XLS);
        break;
    }
  }
}
