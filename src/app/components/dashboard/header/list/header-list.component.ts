import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MessageHandler } from '@core/providers';
import { AuthenticateService, CustomCookieService, PopoverService } from '@core/services';
import { OverviewMode } from '@dashboard/dashboard.enum';
import { DashboardService } from '@dashboard/dashboard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PopoverCloseEvent } from '@shared/components';
import { SettingsCode } from '@shared/enums';
import { IFilter } from '@shared/interfaces';

import { HeaderConst } from '../header.const';
import { ISiteList } from '../header.interface';
import { HeaderService } from '../header.service';

import { HeaderTable } from './header-list.const';

@UntilDestroy()
@Component({
  selector: 'app-header-list',
  templateUrl: './header-list.component.html',
  styleUrls: ['./header-list.component.scss'],
})
export class HeaderListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() set setFilters(filters: IFilter) {
    if (filters) {
      this.fetchData(filters);
    }
  }
  dataSource: MatTableDataSource<ISiteList>;
  isGuest: boolean;
  selection: SelectionModel<ISiteList> = new SelectionModel<ISiteList>(false);
  administrativeUnitLabel: string;
  organisationLabel: string;
  readonly columns = HeaderTable.COLUMNS;
  readonly displayedColumns: string[] = [
    HeaderTable.COLUMNS.SITE,
    HeaderTable.COLUMNS.STATE,
    HeaderTable.COLUMNS.PROGRAMME,
    HeaderTable.COLUMNS.COMPANY,
    HeaderTable.COLUMNS.CAPACITY,
  ];

  constructor(private headerService: HeaderService,
              private dashboardService: DashboardService,
              private popOver: PopoverService,
              private authService: AuthenticateService,
              private messageHandler: MessageHandler,
              private customCookieService: CustomCookieService) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.administrativeUnitLabel = this.customCookieService.get(SettingsCode[SettingsCode.ADMINISTRATIVE_UNIT_LABEL]);
    this.organisationLabel = this.customCookieService.get(SettingsCode[SettingsCode.ORGANISATION_LABEL]);
    this.isGuest = this.authService.isGuest();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSiteClick(element: ISiteList, origin: HTMLElement, content: TemplateRef<HTMLElement>) {
    this.popOver
      .open<{ changeToSiteView: boolean }>({
        content,
        origin,
        width: '200px',
        data: { changeToSiteView: false },
      })
      .afterClosed$.subscribe((result: PopoverCloseEvent) => {
        if (this.authService.isGuest()) {
          this.messageHandler.handleMessageInfo(HeaderConst.LABELS.DISABLED_SITE);
        } else if (result.data && result.data.changeToSiteView === true) {
          this.dashboardService.setSite(element.id);
          this.dashboardService.setOverviewMode(OverviewMode.SITE);
        }
      });
  }

  private fetchData(filters: IFilter) {
    this.headerService.getSitesByFilters(filters)
      .pipe(untilDestroyed(this))
      .subscribe((data: ISiteList[]) => {
        this.dataSource.data = data;

        if (this.selection.selected.length) {
          const selected = data.find((item: ISiteList) => item.id === this.selection.selected[0].id);

          if (selected) {
            this.selection.toggle(selected);
          } else {
            this.dashboardService.setSite(null);
          }
        }

        this.dataSource._updateChangeSubscription();
      });
  }
}
