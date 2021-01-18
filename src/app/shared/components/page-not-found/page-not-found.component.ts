import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthenticateService } from '@core/services/authenticate.service';
import { PreviousRouteService } from '@core/services/previous-route.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';

@UntilDestroy()
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['../../styles/auth.scss'],
})
export class PageNotFoundComponent implements OnInit {
  previousRoute: string;
  fallback: boolean;
  isAuthenticated: boolean;
  readonly routes = AppConst.MAIN_ROUTES;
  readonly smallScreen: boolean;

  constructor(private route: ActivatedRoute,
              private previousRouteService: PreviousRouteService,
              private authService: AuthenticateService) {
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(untilDestroyed(this))
      .subscribe((params: Params) => {
        this.fallback = params.fallback;
      });
    this.isAuthenticated = this.authService.authenticated();
    this.previousRoute = this.previousRouteService.getPreviousUrl();
  }
}
