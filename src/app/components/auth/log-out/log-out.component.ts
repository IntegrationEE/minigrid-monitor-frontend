import { Component, OnInit } from '@angular/core';
import { CustomCookieService } from '@core/services';
import { AppConst } from 'app/app.const';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['../../../shared/styles/auth.scss'],
})
export class LogOutComponent implements OnInit {
  signInLink: string = `/${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.SIGN_UP}`;

  constructor(private customCookieService: CustomCookieService) { }

  ngOnInit() {
    this.customCookieService.deleteAll();
  }
}
