import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.pipe(untilDestroyed(this)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  getPreviousUrl() {
    return this.previousUrl &&
      !this.previousUrl.includes(AppConst.MAIN_ROUTES.PAGE_NOT_FOUND) ?
      this.previousUrl : '/home';
  }
}
