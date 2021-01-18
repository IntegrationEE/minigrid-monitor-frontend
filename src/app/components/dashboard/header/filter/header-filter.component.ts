import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageHandler } from '@core/providers';
import { AuthenticateService, CustomCookieService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsCode } from '@shared/enums';
import { AppConst } from 'app/app.const';

import { HeaderConst } from '../header.const';
import { IFilterLight } from '../header.interface';
import { HeaderService } from '../header.service';

@UntilDestroy()
@Component({
  selector: 'app-header-filter',
  templateUrl: './header-filter.component.html',
  styleUrls: ['../header.component.scss'],
})
export class HeaderFilterComponent implements OnInit {
  @Input() set setData(data: IFilterLight[]) {
    this.data = [...data];
    this.allData = [...data];

    this.selected = this.headerService.getFiltered(data, [...this.selected]);

    if (this.data && this.data.length && this.isInit) {
      this.selectAllCheckbox(this.data);
      this.isInit = false;
    }

    this.selectedAll = this.allData.length === this.selected.length;
  }
  @Input() set setTitle(title: string) {
    this.title = title;
  }
  @Input() set setCallback(callback: any) {
    this.callback = callback;
  }

  title: string;
  isGuest: boolean;
  organisationLabel: string;
  data: IFilterLight[];
  selected: number[] = [];
  searchText: string;
  callback: any;
  selectedAll: boolean = true;
  isInit: boolean = true;
  magnifierIconUrl: string = AppConst.ICONS.magnifier;
  filterControl: FormControl;
  private allData: IFilterLight[];

  constructor(private authService: AuthenticateService,
              private messageHandler: MessageHandler,
              private customCookieService: CustomCookieService,
              private headerService: HeaderService) {
  }

  ngOnInit() {
    this.isGuest = this.authService.isGuest();
    this.organisationLabel = this.customCookieService.get(SettingsCode[SettingsCode.ORGANISATION_LABEL]);
    this.filterControl = new FormControl({value: '', disabled: this.isGuest && this.title === this.organisationLabel}),
    this.filterControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((val: string) => {
        if (!val) {
          this.data = [...this.allData];

          return;
        }

        const pattern = new RegExp(val, 'gi');
        const options = this.allData.filter((opt: IFilterLight) => pattern.test(opt.name));

        this.data = options;
      });
  }

  selectAll() {
    this.selectedAll = !this.selectedAll;
    if (this.selectedAll) {
      this.selectAllCheckbox(this.data);
    } else {
      this.selected = [];
    }
    this.updateFilters();
  }

  selectAllCheckbox(data: IFilterLight[]) {
    data.forEach((item: IFilterLight) => {
      if (!this.selected.includes(item.id) && !item.disabled) {
        this.selected.push(item.id);
      }
    });
  }

  toggle(data: IFilterLight) {
    if (this.selected.includes(data.id)) {
      this.unselect(data.id);
    } else {
      this.select(data.id);
    }
    this.selectedAll = this.selected.length === this.allData.length;
  }

  checkIsGuest(event: Event) {
    if (this.isGuest) {
      this.messageHandler.handleMessageInfo(HeaderConst.LABELS.DISABLED_FILTERS);
      event.preventDefault();
    }
  }

  isActive(id: number) {
    return this.selected.includes(id);
  }

  private select(id: number) {
    this.selected.push(id);

    this.updateFilters();
  }

  private unselect(id: number) {
    const idx = this.selected.indexOf(id);

    this.selected.splice(idx, 1);

    this.updateFilters();
  }

  private updateFilters() {
    if (!this.callback) { return; }

    this.callback(this.selected);
  }
}
