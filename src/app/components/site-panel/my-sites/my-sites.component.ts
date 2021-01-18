import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ISiteCard } from './my-sites.interface';
import { MySitesService } from './my-sites.services';

@UntilDestroy()
@Component({
  selector: 'app-my-sites',
  templateUrl: './my-sites.component.html',
  styleUrls: ['./my-sites.component.scss'],
})
export class MySitesComponent implements OnInit {
  data: ISiteCard[] = [];
  current: ISiteCard;
  showAll: Boolean = false;
  maxItemsOnLoad: number = 7;

  constructor(private mySiteService: MySitesService,
              private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.current = null;
    this.fetchData();

    this.mySiteService.getRefreshSiteList()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.fetchData();
      });

    this.breadcrumbsService.getRefreshPage()
      .pipe(untilDestroyed(this))
      .subscribe((refresh: boolean) => {
        if (refresh) {
          this.current = null;
          this.fetchData();
        }
      });
  }

  showAllSites() {
    this.showAll = !this.showAll;
  }

  goToSiteDetails(site: ISiteCard) {
    this.current = site;
    this.breadcrumbsService.setLabel(site.name);
  }

  createNewSite() {
    this.current = {} as ISiteCard;
    this.breadcrumbsService.setLabel('New site');
  }

  private fetchData() {
    this.mySiteService.getAll()
      .pipe(untilDestroyed(this))
      .subscribe((data: ISiteCard[]) => {
        this.data = data;
      });
  }
}
