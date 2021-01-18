import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbsService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { ISiteCard } from '../my-sites';

import { ISite } from './site-management.interface';
import { CurrentSiteService } from './site-management.service';

@UntilDestroy()
@Component({
  selector: 'app-site-management',
  templateUrl: './site-management.component.html',
  styleUrls: ['./site-management.component.scss'],
})
export class SiteManagementComponent implements OnInit, OnDestroy {
  @Input() set setSite(site: ISiteCard) {
    this.siteId = site.id;

    if (this.siteId) {
      this.loading = true;
      this.siteService.get(this.siteId)
        .pipe(untilDestroyed(this), finalize(() => this.loading = false))
        .subscribe();
    } else {
      this.currentSiteService.setValue({ id: site.id } as ISite);
      this.loading = false;
    }
  }
  siteId: number;
  loading: boolean = true;

  constructor(private currentSiteService: CurrentSiteService,
              private siteService: CurrentSiteService,
              private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.currentSiteService.getRefresh()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const site: ISite = this.currentSiteService.getValue();

        if (site) {
          this.siteId = site.id;
          this.breadcrumbsService.setLabel(site.name);
        }
      });
  }

  ngOnDestroy() {
    this.currentSiteService.setValue(null);
    this.currentSiteService.setQrCodeValue(null);
  }
}
