import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService, CustomCookieService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';
import { interval } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  username: string;
  showMySites: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  isProgrammeManager: boolean;
  isAuthenticated: boolean = false;
  isHeadOfCompany: boolean = false;
  readonly icons = AppConst.ICONS;
  readonly routes = AppConst.MAIN_ROUTES;
  private readonly logOutUrl: string = `${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.LOG_OUT}`;

  constructor(private authService: AuthenticateService,
              private customCookieService: CustomCookieService,
              private router: Router) {
  }

  ngOnInit() {
    this.customCookieService.authChanged()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.isAuthenticated = this.authService.authenticated() && !isNaN(this.authService.getCompanyId());
        this.isGuest = this.authService.isGuest();

        if (this.isAuthenticated) {
          this.username = this.authService.getUserName();
          this.isAdmin = this.authService.isAdmin();
          this.isProgrammeManager = this.authService.isProgrammeManager();
          this.isHeadOfCompany = this.authService.isHeadOfCompany();

          this.showMySites = this.authService.isDeveloper() || this.authService.isProgrammeManager();
        }
      });

    interval(3000)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.isAuthenticated && this.authService.tokenExpired()) {
          this.router.navigate([this.logOutUrl]);
        }
      });
  }

  logout() {
    this.router.navigate([this.logOutUrl]);
  }
}
