import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete/autocomplete-trigger';
import { AuthenticateService, CustomCookieService, EnumService } from '@core/services';
import { OverviewMode } from '@dashboard/dashboard.enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GridConnection, RenewableTechnology, SettingsCode } from '@shared/enums';
import { IEnum, IFilter } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { uniq } from 'lodash';
import { forkJoin } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { DashboardService } from '../dashboard.service';

import { HeaderTemplateMode } from './header.enum';
import { IFilterLight, ISiteLight } from './header.interface';
import { HeaderService } from './header.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isGuest: boolean;
  templateMode: HeaderTemplateMode = HeaderTemplateMode.MAP;
  filter: IFilter;
  states: IFilterLight[] = [];
  programmes: IFilterLight[] = [];
  companies: IFilterLight[] = [];
  technologies: IEnum<RenewableTechnology>[] = [];
  gridConnections: IEnum<GridConnection>[] = [];

  allSites: ISiteLight[] = [];
  sites: ISiteLight[] = [];
  filteredSites: ISiteLight[] = [];

  minCapacity: number = 0;
  maxCapacity: number = 1000;
  disableCapacitySlider: boolean = false;
  closeActivated: boolean;

  onStatesChange = this.onFilterChange.bind(this, AppConst.FILTER_TYPES.STATES);
  onProgrammesChange = this.onFilterChange.bind(this, AppConst.FILTER_TYPES.PROGRAMMES);
  onCompaniesChange = this.onFilterChange.bind(this, AppConst.FILTER_TYPES.COMPANIES);
  onTechnologyChange = this.onFilterChange.bind(this, AppConst.FILTER_TYPES.TECHNOLOGIES);
  onGridConnectionChange = this.onFilterChange.bind(this, AppConst.FILTER_TYPES.GRID_CONNECTIONS);
  magnifierIconUrl: string = AppConst.ICONS.magnifier;
  listIconUrl: string = AppConst.ICONS.stack;
  mapIconUrl: string = AppConst.ICONS.mapGreen;
  siteControl: FormControl;
  administrativeUnitLabel: string;
  organisationLabel: string;

  readonly modes: typeof HeaderTemplateMode = HeaderTemplateMode;

  constructor(private dashboardService: DashboardService,
              private headerService: HeaderService,
              private enumService: EnumService,
              private authService: AuthenticateService,
              private customCookieService: CustomCookieService) {
  }

  ngOnInit() {
    this.siteControl = new FormControl('');
    this.administrativeUnitLabel = this.customCookieService.get(SettingsCode[SettingsCode.ADMINISTRATIVE_UNIT_LABEL]);
    this.organisationLabel = this.customCookieService.get(SettingsCode[SettingsCode.ORGANISATION_LABEL]);

    this.isGuest = this.authService.isGuest();
    if (this.isGuest) {
      this.siteControl.disable();
    }

    this.dashboardService.getSite()
      .pipe(untilDestroyed(this))
      .subscribe((siteId: number) => {
        if (siteId && !this.siteControl.value) {
          const selectedSite: ISiteLight = this.allSites.find((site: ISiteLight) => site.id === siteId);

          this.siteControl.setValue(selectedSite.name);
          const filter = { ...this.filter, siteId };

          this.setFilter(filter);
        }
      });

    this.siteControl.valueChanges
      .pipe(untilDestroyed(this), startWith(''))
      .subscribe((value: string) => {
        this.filterSites(value);
      });

    this.fetchData();
    this.getData();
  }

  clear(trigger: MatAutocompleteTrigger) {
    this.siteControl.setValue('');
    setTimeout(() => {
      trigger.openPanel();
    });
  }

  onSiteClosed() {
    let siteId = null;
    const choosenSite = this.allSites.find((site: ISiteLight) => site.name === this.siteControl.value);

    if (!choosenSite && this.closeActivated) {
      this.closeActivated = false;

      return;
    }
    if (choosenSite) {
      siteId = choosenSite.id;
      this.closeActivated = false;
      this.dashboardService.setSite(choosenSite.id);
      if (!this.dashboardService.isOverviewModeSite()) {
        this.dashboardService.setOverviewMode(OverviewMode.SITE);
      }
    } else {
      this.closeActivated = true;
      this.siteControl.setValue('');
      this.dashboardService.setSite(null);
      if (this.dashboardService.isOverviewModeSite()) {
        this.dashboardService.setOverviewMode(OverviewMode.PORTFOLIO);
      }
    }

    if (!this.isGuest) {
      const filter = { ...this.filter, siteId };

      this.setFilter(filter);
    }
  }

  onFilterChange(type: string, values: number[]) {
    const update = {};

    update[type] = values;

    this.filtersList(type, values);
    this.updateSelected();

    this.setFilter({ ...this.filter, ...update });
  }

  onTemplateChange(mode: HeaderTemplateMode) {
    this.templateMode = mode;

    this.mapIconUrl = AppConst.ICONS.map;
    this.listIconUrl = AppConst.ICONS.stack;

    if (mode === HeaderTemplateMode.LIST) {
      this.listIconUrl = AppConst.ICONS.stackGreen;
    } else {
      this.mapIconUrl = AppConst.ICONS.mapGreen;
    }
  }

  onFromChange(val: number) {
    this.filteredByCapacity(val, this.filter.to);
    this.updateSelected();
    this.setFilter({ ...this.filter, from: val });
  }

  onToChange(val: number) {
    this.filteredByCapacity(this.filter.from, val);
    this.updateSelected();
    this.setFilter({ ...this.filter, to: val });
  }

  private filterSites(val: string) {
    this.filteredSites = [...this.allSites].filter((site: ISiteLight) =>
      site.name.toLowerCase().includes((val || '').toLowerCase()));
  }

  private filtersList(type: string, values: number[]) {
    let siteIds: number[];

    switch (type) {
      case AppConst.FILTER_TYPES.STATES:
        siteIds = this.headerService.getFilteredSiteIds(this.allSites, this.states, values);

        this.programmes = this.headerService.getDisabled(this.allSites, [...this.programmes], siteIds);
        this.companies = this.headerService.getDisabled(this.allSites, [...this.companies], siteIds);
        this.technologies = this.headerService.getDisabledTechnologies(this.allSites, [...this.technologies], siteIds);
        this.gridConnections = this.headerService.getDisabledGridConnections(this.allSites, [...this.gridConnections], siteIds);
        break;
      case AppConst.FILTER_TYPES.PROGRAMMES:
        siteIds = this.headerService.getFilteredSiteIds(this.allSites, this.programmes, values);

        this.states = this.headerService.getDisabled(this.allSites, [...this.states], siteIds);
        this.companies = this.headerService.getDisabled(this.allSites, [...this.companies], siteIds);
        this.technologies = this.headerService.getDisabledTechnologies(this.allSites, [...this.technologies], siteIds);
        this.gridConnections = this.headerService.getDisabledGridConnections(this.allSites, [...this.gridConnections], siteIds);
        break;
      case AppConst.FILTER_TYPES.COMPANIES:
        siteIds = this.headerService.getFilteredSiteIds(this.allSites, this.companies, values);

        this.states = this.headerService.getDisabled(this.allSites, [...this.states], siteIds);
        this.programmes = this.headerService.getDisabled(this.allSites, [...this.programmes], siteIds);
        this.technologies = this.headerService.getDisabledTechnologies(this.allSites, [...this.technologies], siteIds);
        this.gridConnections = this.headerService.getDisabledGridConnections(this.allSites, [...this.gridConnections], siteIds);
        break;
      case AppConst.FILTER_TYPES.TECHNOLOGIES:
        siteIds = this.headerService.getFilteredSiteIdsByTechnology(this.allSites, values);

        this.states = this.headerService.getDisabled(this.allSites, [...this.states], siteIds);
        this.programmes = this.headerService.getDisabled(this.allSites, [...this.programmes], siteIds);
        this.companies = this.headerService.getDisabled(this.allSites, [...this.companies], siteIds);
        this.gridConnections = this.headerService.getDisabledGridConnections(this.allSites, [...this.gridConnections], siteIds);
        break;
      case AppConst.FILTER_TYPES.GRID_CONNECTIONS:
        siteIds = this.headerService.getFilteredSiteIdsByGridConnection(this.allSites, values);

        this.states = this.headerService.getDisabled(this.allSites, [...this.states], siteIds);
        this.programmes = this.headerService.getDisabled(this.allSites, [...this.programmes], siteIds);
        this.companies = this.headerService.getDisabled(this.allSites, [...this.companies], siteIds);
        this.technologies = this.headerService.getDisabledTechnologies(this.allSites, [...this.technologies], siteIds);
        break;
      default:
        break;
    }

    this.setCapacityFilterBoundaries(siteIds);
  }

  private filteredByCapacity(from: number, to: number) {
    const siteIds: number[] = this.headerService.getFilteredSiteIdsByCapacity(this.allSites, from, to);

    this.states = this.headerService.getDisabled(this.allSites, [...this.states], siteIds);
    this.programmes = this.headerService.getDisabled(this.allSites, [...this.programmes], siteIds);
    this.companies = this.headerService.getDisabled(this.allSites, [...this.companies], siteIds);
    this.technologies = this.headerService.getDisabledTechnologies(this.allSites, [...this.technologies], siteIds);
    this.gridConnections = this.headerService.getDisabledGridConnections(this.allSites, [...this.gridConnections], siteIds);
  }

  private updateSelected() {
    this.filter.companies = this.headerService.getFiltered(this.companies, [...this.filter.companies]);
    this.filter.programmes = this.headerService.getFiltered(this.programmes, [...this.filter.programmes]);
    this.filter.states = this.headerService.getFiltered(this.states, [...this.filter.states]);
    this.filter.technologies = this.headerService.getFilteredEnum(this.technologies, [...this.filter.technologies]);
    this.filter.gridConnections = this.headerService.getFilteredEnum(this.gridConnections, [...this.filter.gridConnections]);
  }

  private setFilter(filter?: IFilter) {
    filter.state_names = [];
    filter.states = filter.states.filter((stateId: number) => stateId > -1);
    filter.states.forEach((stateID: number) => {
      filter.state_names.push(this.states.find((option: IFilterLight) => option.id === stateID).name);
    });

    if (!filter.states.length) {
      filter.states.push(-1);
    }

    this.filter = filter;

    if (uniq(this.filter && this.filter.programmes).length === 1) {
      this.dashboardService.setProgrammeId(this.filter.programmes[0]);
    } else if (this.dashboardService.getMode() === OverviewMode.PROGRAMME) {
      this.dashboardService.setOverviewMode(OverviewMode.PORTFOLIO);
      this.dashboardService.setProgrammeId(null);
    } else {
      this.dashboardService.setProgrammeId(null);
    }

    this.dashboardService.setfilters(filter);
  }

  private setCapacityFilterBoundaries(siteIds: number[]) {
    const capacities: number[] = [...this.sites]
      .filter((site: ISiteLight) => siteIds.includes(site.id))
      .map((site: ISiteLight) => site.renewableCapacity);

    let min: number = 0;
    let max: number = 0;

    if (capacities.length > 0) {
      min = capacities.reduce((prev: number, current: number) => prev < current ? prev : current);
      max = capacities.reduce((prev: number, current: number) => prev > current ? prev : current);
    }

    this.minCapacity = min;
    this.maxCapacity = max;

    this.filter.from = min;
    this.filter.to = max;

    this.disableCapacitySlider = capacities.length < 2;
  }

  private fetchData() {
    this.technologies = this.enumService.getRenewableTechnologiesValue();
    if (!this.technologies) {
      this.enumService.getRenewableTechnologies()
        .pipe(untilDestroyed(this))
        .subscribe((response: IEnum<RenewableTechnology>[]) => {
          this.technologies = response;
        });
    }

    this.gridConnections = this.enumService.getGridConnectionsValue();
    if (!this.gridConnections) {
      this.enumService.getGridConnections()
        .pipe(untilDestroyed(this))
        .subscribe((response: IEnum<GridConnection>[]) => {
          this.gridConnections = response;
        });
    }
  }

  private getData() {
    forkJoin(
      [
        this.headerService.getStates(),
        this.headerService.getProgrammes(),
        this.headerService.getCompanies(),
        this.headerService.getSites(),
      ])
      .pipe(untilDestroyed(this))
      .subscribe((response: [IFilterLight[], IFilterLight[], IFilterLight[], ISiteLight[]]) => {
        this.states = response[0];
        this.programmes = response[1];
        this.companies = response[2];
        this.allSites = response[3];
        this.sites = response[3];
        this.filteredSites = response[3];

        const filter: IFilter = {
          state_names: [],
          states: [],
          companies: [],
          programmes: [],
          technologies: [],
          gridConnections: [],
          from: 0,
          to: 1000,
        };

        this.companies.forEach((item: IFilterLight) => filter.companies.push(item.id));
        this.programmes.forEach((item: IFilterLight) => filter.programmes.push(item.id));
        this.states.forEach((item: IFilterLight) => filter.states.push(item.id));
        this.technologies.forEach((item: IEnum<RenewableTechnology>) => filter.technologies.push(item.value));
        this.gridConnections.forEach((item: IEnum<GridConnection>) => filter.gridConnections.push(item.value));

        this.setFilter(filter);
        this.setCapacityFilterBoundaries(this.sites.map((site: ISiteLight) => site.id));
      });
  }
}
