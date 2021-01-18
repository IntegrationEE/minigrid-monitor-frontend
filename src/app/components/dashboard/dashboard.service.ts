import { IFilter } from '@shared/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

import { OverviewMode } from './dashboard.enum';

export class DashboardService {
  private overviewMode: BehaviorSubject<OverviewMode> = new BehaviorSubject<OverviewMode>(OverviewMode.PORTFOLIO);
  private filters: BehaviorSubject<IFilter> = new BehaviorSubject<IFilter>(null);
  private site: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private programmeId: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  isOverviewModeSite(): boolean {
    return this.overviewMode.getValue() === OverviewMode.SITE;
  }

  setOverviewMode(mode: OverviewMode) {
    const currentFilters: IFilter = this.filters.value;

    if (currentFilters) {
      currentFilters.level = mode;
      this.filters.next(currentFilters);
    }

    this.overviewMode.next(mode);
  }

  getOverviewMode(): Observable<OverviewMode> {
    return this.overviewMode.asObservable();
  }

  getMode(): OverviewMode {
    return this.overviewMode.value || null;
  }

  setfilters(filters: IFilter) {
    this.filters.next(filters);
  }

  getFilters(): Observable<IFilter> {
    return this.filters.asObservable();
  }

  getSite(): Observable<number> {
    return this.site.asObservable();
  }

  setSite(id: number) {
    this.site.next(id);
  }

  getProgrammeId(): Observable<number> {
    return this.programmeId.asObservable();
  }

  setProgrammeId(id: number) {
    this.programmeId.next(id);
  }
}
