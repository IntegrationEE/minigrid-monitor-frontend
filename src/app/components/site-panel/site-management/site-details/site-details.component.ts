import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ISiteMenu, SiteMenuMode, SiteMenuPage } from '../site-menu';

@UntilDestroy()
@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
})
export class SiteDetailsComponent {
  currentPage: SiteMenuPage = SiteMenuPage.INFO;
  menuConfig: ISiteMenu;
  readonly menuMode: SiteMenuMode = SiteMenuMode.DETAILS;
  readonly pages: typeof SiteMenuPage = SiteMenuPage;

  changePage(page: SiteMenuPage) {
    this.currentPage = page;
  }
}
