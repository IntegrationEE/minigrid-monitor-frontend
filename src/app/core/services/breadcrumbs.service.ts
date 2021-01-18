import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private currentLabel: BehaviorSubject<string> = new BehaviorSubject(null);
  private refreshPage: BehaviorSubject<boolean> = new BehaviorSubject(null);

  setLabel(name: string) {
    this.currentLabel.next(name);
  }

  getLabel(): Observable<string> {
    return this.currentLabel.asObservable();
  }

  setRefreshPage(name: boolean) {
    this.refreshPage.next(name);
  }

  getRefreshPage(): Observable<boolean> {
    return this.refreshPage.asObservable();
  }

  clear() {
    this.refreshPage.next(false);
    this.currentLabel.next(null);
  }
}
