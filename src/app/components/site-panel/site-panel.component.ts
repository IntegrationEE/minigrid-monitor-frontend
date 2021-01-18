import { Component } from '@angular/core';
import { AppConst } from 'app/app.const';

@Component({
  selector: 'app-site-panel',
  templateUrl: './site-panel.component.html',
})
export class SitePanelComponent {
  parent: string = AppConst.MAIN_ROUTES.SITES;
  current: string;
}
