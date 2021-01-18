import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utils } from '@core/providers';
import { environment } from '@env/environment';
import { GridConnection, RenewableTechnology } from '@shared/enums';
import { IEnum, IFilter } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { filter, uniq } from 'lodash';
import { Observable } from 'rxjs';

import { IFilterLight, ISiteLight, ISiteList } from './header.interface';

@Injectable()
export class HeaderService {
  private readonly baseUrl: string = `${environment.apiUrl}`;
  constructor(private http: HttpClient,
              private utils: Utils) {
  }

  getStates(): Observable<IFilterLight[]> {
    return this.http.get<IFilterLight[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.STATES}${AppConst.REQUESTS_URL.FILTERS}`);
  }

  getProgrammes(): Observable<IFilterLight[]> {
    return this.http.get<IFilterLight[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.PROGRAMMES}${AppConst.REQUESTS_URL.FILTERS}`);
  }

  getCompanies(): Observable<IFilterLight[]> {
    return this.http.get<IFilterLight[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.COMPANIES}${AppConst.REQUESTS_URL.FILTERS}`);
  }

  getSites(): Observable<ISiteLight[]> {
    return this.http.get<ISiteLight[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.SITES}${AppConst.REQUESTS_URL.LIST}`);
  }

  getSitesByFilters(filters: IFilter): Observable<ISiteList[]> {
    return this.http.post<ISiteList[]>(`${this.baseUrl}${AppConst.REQUESTS_URL.SITES}${AppConst.REQUESTS_URL.FILTERS}`,
      this.utils.clearRequest(filters),
    );
  }

  getDisabled(allSites: ISiteLight[], data: IFilterLight[], siteIds: number[]): IFilterLight[] {
    if (siteIds.length === allSites.length) {
      data.forEach((item: IFilterLight) => {
        item.selected = item.disabled;
        item.disabled = false;
      });
    } else {
      data.forEach((item: IFilterLight) => {
        const isDisabled = !item.siteIds.some((siteId: number) => siteIds.includes(siteId));

        item.selected = item.disabled && !isDisabled;
        item.disabled = isDisabled;
      });
    }

    return [...data];
  }

  getFiltered(allItems: IFilterLight[], data: number[]): number[] {
    const selected: number[] = data.filter((id: number) => {
      return allItems.some((item: IFilterLight) => item.id === id && !item.disabled);
    });

    if (allItems.some((item: IFilterLight) => item.selected)) {
      allItems
        .filter((item: IFilterLight) => item.selected)
        .forEach((item: IFilterLight) => {
          selected.push(item.id);
        });
    }

    return [...selected];
  }

  getFilteredEnum<T>(allItems: IEnum<T>[], data: T[]): T[] {
    const selected: T[] = data.filter((current: T) => {
      return allItems.some((item: IEnum<T>) => item.value === current && !item.disabled);
    });

    if (allItems.some((item: IEnum<T>) => item.selected)) {
      allItems
        .filter((item: IEnum<T>) => item.selected)
        .forEach((item: IEnum<T>) => {
          selected.push(item.value);
        });
    }

    return [...selected];
  }

  getFilteredSiteIds(allSites: ISiteLight[], collection: IFilterLight[], selected: number[]): number[] {
    if (selected.length > 0) {
      let siteIds: number[] = [];

      collection.forEach((item: IFilterLight) => {
        if (selected.includes(item.id)) {
          siteIds = siteIds.concat(item.siteIds);
        }
      });

      return uniq(siteIds);
    } else {
      return allSites.map((item: ISiteLight) => item.id);
    }
  }

  getFilteredSiteIdsByCapacity(allSites: ISiteLight[], from: number, to: number): number[] {
    return filter(allSites, ((site: ISiteLight) => site.renewableCapacity >= from && site.renewableCapacity <= to))
      .map((site: ISiteLight) => site.id);
  }

  getFilteredSiteIdsByTechnology(allSites: ISiteLight[], technologies: RenewableTechnology[]): number[] {
    return (
      technologies.length > 0 ?
        filter(allSites, ((site: ISiteLight) => technologies.includes(site.renewableTechnology))) :
        [...allSites]
    ).map((site: ISiteLight) => site.id);
  }

  getFilteredSiteIdsByGridConnection(allSites: ISiteLight[], gridConnections: GridConnection[]): number[] {
    return (
      gridConnections.length > 0 ?
        filter(allSites, ((site: ISiteLight) => gridConnections.includes(site.gridConnection))) :
        [...allSites]
    ).map((site: ISiteLight) => site.id);
  }

  getDisabledTechnologies(allSites: ISiteLight[], technologies: IEnum<RenewableTechnology>[],
                          siteIds: number[]): IEnum<RenewableTechnology>[] {
    if (siteIds.length === allSites.length) {
      technologies.forEach((technology: IEnum<RenewableTechnology>) => {
        technology.selected = technology.disabled;
        technology.disabled = false;
      });
    } else {
      const filtered: RenewableTechnology[] = uniq(filter(allSites, ((site: ISiteLight) => siteIds.includes(site.id)))
        .map((site: ISiteLight) => site.renewableTechnology));

      technologies.forEach((technology: IEnum<RenewableTechnology>) => {
        const isDisabled = !filtered.includes(technology.value);

        technology.selected = technology.disabled && !isDisabled;
        technology.disabled = isDisabled;
      });
    }

    return technologies;
  }

  getDisabledGridConnections(allSites: ISiteLight[], gridConnections: IEnum<GridConnection>[],
                             siteIds: number[]): IEnum<GridConnection>[] {
    if (siteIds.length === allSites.length) {
      gridConnections.forEach((gridConnection: IEnum<GridConnection>) => {
        gridConnection.selected = gridConnection.disabled;
        gridConnection.disabled = false;
      });
    } else {
      const filtered: GridConnection[] = uniq(filter(allSites, ((site: ISiteLight) => siteIds.includes(site.id)))
        .map((site: ISiteLight) => site.gridConnection));

      gridConnections.forEach((gridConnection: IEnum<GridConnection>) => {
        const isDisabled = !filtered.includes(gridConnection.value);

        gridConnection.selected = gridConnection.disabled && !isDisabled;
        gridConnection.disabled = isDisabled;
      });
    }

    return gridConnections;
  }
}
