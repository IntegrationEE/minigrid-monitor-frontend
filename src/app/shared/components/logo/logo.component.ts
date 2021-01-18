import { Component, Input } from '@angular/core';
import { AppConst } from 'app/app.const';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  @Input() className: string = 'mb-2';
  @Input() isAuthenticated: boolean;
  logoUrl: string = AppConst.ICONS.logo;
  redirectLink: string = AppConst.MAIN_ROUTES.DASHBOARD;
}
