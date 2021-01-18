import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ConventionalTechnology, GridConnection, RenewableTechnology, SiteStatus } from '@shared/enums';
import { AppConst } from 'app/app.const';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISiteCard } from './my-sites.interface';

@Injectable()
export class MySitesService {
  readonly icons = AppConst.ICONS;
  private refreshList: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly baseUrl: string = `${environment.apiUrl}${AppConst.REQUESTS_URL.SITES}`;
  constructor(private http: HttpClient) { }

  getAll(): Observable<ISiteCard[]> {
    return this.http.get<ISiteCard[]>(`${this.baseUrl}`)
      .pipe(map((data: ISiteCard[]) => {
        data.forEach((item: ISiteCard) => {
          item.statusTooltip = this.getStatusTooltipText(item.status);
          item.statusClass = this.getStatusColorClass(item.status);
          item.renewableTechnologyIcon = this.getRenewableTechnologyIcon(item.renewableTechnology);
          item.conventionalTechnologyIcon = this.getConventionalTechnologyIcon(item.conventionalTechnology);
          item.gridConnectionIcon = this.getGridConnectionIcon(item.gridConnection);
        });

        return data;
      }));
  }

  delete(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete<HttpResponse<unknown>>(`${this.baseUrl}/${id}`);
  }

  publishedUnpublished(id: number): Observable<ISiteCard> {
    return this.http.patch<ISiteCard>(`${this.baseUrl}/${id}/${AppConst.REQUESTS_URL.PUBLISHED}`, {});
  }

  getRefreshSiteList(): Observable<boolean> {
    return this.refreshList.asObservable();
  }

  refreshSiteList() {
    this.refreshList.next(true);
  }

  private getStatusColorClass(index: number) {
    let statusColorClass: string = 'circle';

    switch (index) {
      case SiteStatus.UP_TO_DATE:
        statusColorClass += ' statusGreen';
        break;
      case SiteStatus.INFORMATION_MISSING:
        statusColorClass += ' statusOrange';
        break;
      case SiteStatus.OUT_OF_OPERATION:
        statusColorClass += ' statusRed';
        break;
    }

    return statusColorClass || '';
  }

  private getStatusTooltipText(index: number) {
    let statusText: string;

    switch (index) {
      case SiteStatus.UP_TO_DATE:
        statusText = 'Up-to-date information available';
        break;
      case SiteStatus.INFORMATION_MISSING:
        statusText = 'Information missing';
        break;
      case SiteStatus.OUT_OF_OPERATION:
        statusText = 'Site out of operation';
        break;
    }

    return statusText || '';
  }

  private getRenewableTechnologyIcon(technology: RenewableTechnology): string {
    let icon: string;

    switch (technology) {
      case RenewableTechnology.PV:
        icon = this.icons.sun;
        break;
      case RenewableTechnology.HYDRO:
        icon = this.icons.hydro;
        break;
      case RenewableTechnology.BIOMASS:
        icon = this.icons.biomass;
        break;
      case RenewableTechnology.WIND:
        icon = this.icons.wind;
        break;
    }

    return icon || '';
  }

  private getConventionalTechnologyIcon(technology: ConventionalTechnology): string {
    let icon: string;

    switch (technology) {
      case ConventionalTechnology.BIODIESEL:
        icon = this.icons.graphBiodiesel;
        break;
      case ConventionalTechnology.DIESEL:
        icon = this.icons.battery2;
        break;
    }

    return icon || '';
  }

  private getGridConnectionIcon(type: GridConnection): string {
    let icon: string;

    switch (type) {
      case GridConnection.ON_GRID:
        icon = this.icons.graphOnGrid;
        break;
      case GridConnection.OFF_GRID:
        icon = this.icons.offGrid;
        break;
    }

    return icon || '';
  }
}
