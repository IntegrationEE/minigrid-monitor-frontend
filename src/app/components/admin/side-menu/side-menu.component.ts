import { AdminConst } from '@admin/admin.const';
import { MainConst } from '@admin/main';
import { TablesConst } from '@admin/tables';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { AuthenticateService, CustomCookieService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsCode } from '@shared/enums';
import { AppConst } from 'app/app.const';
import { filter } from 'rxjs/operators';

import { ButtonGroup, ButtonModel } from './side-menu.class';
import { IMargin, IWidth } from './side-menu.interface';

@UntilDestroy()
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @ViewChild('sidenavBig', { static: true }) sidenavBig: MatSidenav;

  organisationLabel: string;
  lgaLabel: string;
  readonly SIDENAV_MAX: string = '230px';
  readonly SIDENAV_MIN: string = '50px';

  width: IWidth = { width: this.SIDENAV_MAX };
  margin: IMargin = { 'margin-left': this.SIDENAV_MAX };
  resized: boolean = false;

  tablesButtonsGroup: ButtonGroup = new ButtonGroup('Tables', AdminConst.ADMIN_ROUTES.TABLES, [
    new ButtonModel('', TablesConst.TABLES_ROUTES.COMPANIES, true),
    new ButtonModel('', TablesConst.TABLES_ROUTES.LGAS, true),
    new ButtonModel('Programmes', TablesConst.TABLES_ROUTES.PROGRAMMES, true),
  ], this.adminCheck());

  mainButtonsGroup: ButtonGroup = new ButtonGroup('Main', AdminConst.ADMIN_ROUTES.MAIN, [
    new ButtonModel('Chart configurations', MainConst.MAIN_ROUTES.CHART_CONFIGURATIONS, true),
    new ButtonModel('Integrations', MainConst.MAIN_ROUTES.INTEGRATIONS, true),
    new ButtonModel('Thresholds', MainConst.MAIN_ROUTES.THRESHOLDS, true),
    new ButtonModel('Users', MainConst.MAIN_ROUTES.USERS, true),
  ], this.adminCheck());

  buttonGroups: ButtonGroup[] = [
    this.mainButtonsGroup,
    this.tablesButtonsGroup,
  ];

  constructor(private router: Router,
              private authService: AuthenticateService,
              private customCookieService: CustomCookieService) {
  }

  ngOnInit() {
    this.removeUnactiveButtons();
    this.expandCurrentRoute(this.router.url);
    this.organisationLabel = this.changeToPlural(this.customCookieService.get(SettingsCode[SettingsCode.ORGANISATION_LABEL]));
    this.lgaLabel = this.changeToPlural(this.customCookieService.get(SettingsCode[SettingsCode.LGA_LABEL]));

    this.tablesButtonsGroup.buttons[0].name = this.organisationLabel;
    this.tablesButtonsGroup.buttons[1].name = this.lgaLabel;

    this.router.events
      .pipe(untilDestroyed(this), filter((event: RouterEvent) => event instanceof NavigationStart && !!event.url))
      .subscribe((event: RouterEvent) => {
        this.expandCurrentRoute(event.url);
      });
  }

  resizeNav() {
    this.resized = !this.resized;
    this.width.width = this.resized ? this.SIDENAV_MIN : this.SIDENAV_MAX;
    this.margin['margin-left'] = this.resized ? this.SIDENAV_MIN : this.SIDENAV_MAX;
  }

  redirect(buttonGroup: ButtonGroup) {
    this.router.navigate([`${AppConst.MAIN_ROUTES.ADMIN}/${buttonGroup.prefix}`]);
  }

  onButtonGroup(buttonGroup: ButtonGroup) {
    buttonGroup.expanded = true;
    this.resizeNav();
  }

  private adminCheck(): boolean {
    return this.authService.isAdmin();
  }

  private changeToPlural(value: string): string {
    return value && value.slice(-1) === 'y' ?
      value.replace(value.slice(-1), 'ies') :
      value + 's';
  }

  private expandCurrentRoute(url?: string) {
    this.buttonGroups.forEach((buttonGroup: ButtonGroup) => buttonGroup.expanded = false);
    if (url.includes(AdminConst.ADMIN_ROUTES.MAIN)) {
      this.checkAndActivate(AdminConst.ADMIN_ROUTES.MAIN);
    }
  }

  private checkAndActivate(path: string) {
    if (this.buttonGroups.some((buttonGroup: ButtonGroup) => buttonGroup.prefix === path)) {
      this.buttonGroups.find((buttonGroup: ButtonGroup) => buttonGroup.prefix === path).expanded = true;
    }
  }

  private removeUnactiveButtons() {
    this.buttonGroups = this.buttonGroups.filter((buttonGroup: ButtonGroup) => buttonGroup.available);
    this.buttonGroups.forEach((buttonGroup: ButtonGroup) => {
      buttonGroup.buttons = buttonGroup.buttons.filter((button: ButtonModel) => button.available);
    });
    this.buttonGroups = this.buttonGroups.filter((buttonGroup: ButtonGroup) => buttonGroup.buttons.length);
  }
}
