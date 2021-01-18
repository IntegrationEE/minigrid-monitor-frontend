import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router, UrlSegment } from '@angular/router';
import { BreadcrumbsService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';
import { isEmpty } from 'lodash';
import { filter } from 'rxjs/operators';

import { IBreadcrumb } from './breadcrumbs.interface';

@UntilDestroy()
@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  @Input() parent: string;
  @Output() refreshPage: EventEmitter<boolean> = new EventEmitter();
  isSubView: boolean = false;
  breadcrumbs: IBreadcrumb[];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.breadcrumbs = [{ label: 'Dashboard', url: `/${AppConst.MAIN_ROUTES.DASHBOARD}` }];
    this.breadcrumbs = this.getBreadcrumbs(this.activatedRoute.root, '', this.breadcrumbs);

    this.breadcrumbsService.getLabel()
      .pipe(untilDestroyed(this), filter((label: string) => !!label))
      .subscribe((label: string) => {
        if (this.breadcrumbs.some((breadcrumb: IBreadcrumb) => breadcrumb.isCustom)) {
          this.breadcrumbs.splice(this.breadcrumbs.length - 1, 1);
        }

        this.location.replaceState(`${this.breadcrumbs[this.breadcrumbs.length - 1].url}/${label}`);
        this.breadcrumbs.push({ label, isCustom: true } as IBreadcrumb);
        this.isSubView = true;
      });
  }

  redirect(url: string) {
    if (url) {
      this.router.navigate([url]);
      this.breadcrumbsService.setLabel(null);

      if (this.isSubView && url === this.router.url) {
        this.location.replaceState(url);
        this.breadcrumbs.splice(-1, 1);
        this.isSubView = false;
        this.breadcrumbsService.setRefreshPage(true);
      }
    }
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB: string = 'breadcrumb';
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      const routeURL: string = child.snapshot.url.map((segment: UrlSegment) => segment.path).join('/');

      url += !isEmpty(routeURL) ? `${routeURL}/` : '';

      breadcrumbs.push({
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        url: `/${this.parent}${!isEmpty(routeURL) ? `/${routeURL}` : ''}`,
      });

      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
