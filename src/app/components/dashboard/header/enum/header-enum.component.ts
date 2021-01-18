import { Component, Input } from '@angular/core';
import { MessageHandler } from '@core/providers';
import { AuthenticateService } from '@core/services';
import { IEnum } from '@shared/interfaces';

import { HeaderConst } from '../header.const';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-header-enum',
  templateUrl: './header-enum.component.html',
  styleUrls: ['../header.component.scss'],
})
export class HeaderEnumComponent<T> {
  @Input() set setData(data: IEnum<T>[]) {
    this.data = [...data];

    this.selected = this.headerService.getFilteredEnum<T>(data, [...this.selected]);

    if (this.data && this.data.length && this.isInit) {
      this.selectAllCheckbox();
      this.isInit = false;
    }

    this.selectedAll = this.data.length === this.selected.length;
  }
  @Input() set setTitle(title: string) {
    this.title = title;
  }
  @Input() set setCallback(callback: any) {
    this.callback = callback;
  }

  title: string;
  data: IEnum<T>[];
  selected: T[] = [];
  callback: any;
  selectedAll: boolean = true;
  isInit: boolean = true;

  constructor(private authService: AuthenticateService,
              private messageHandler: MessageHandler,
              private headerService: HeaderService) {
  }

  selectAll() {
    this.selectedAll = !this.selectedAll;
    if (this.selectedAll) {
      this.selectAllCheckbox();
    } else {
      this.selected = [];
    }
    this.updateFilters();
  }

  toggle(data: IEnum<T>) {
    if (this.selected.includes(data.value)) {
      this.unselect(data.value);
    } else {
      this.select(data.value);
    }

    this.selectedAll = this.selected.length === this.data.length;
  }

  isActive(id: T) {
    return this.selected.includes(id);
  }

  checkIsGuest(event: Event) {
    if (this.authService.isGuest()) {
      this.messageHandler.handleMessageInfo(HeaderConst.LABELS.DISABLED_FILTERS);
      event.preventDefault();
    }
  }

  private selectAllCheckbox() {
    this.data.forEach((item: IEnum<T>) => {
      if (!this.selected.includes(item.value) && !item.disabled) {
        this.selected.push(item.value);
      }
    });
  }

  private select(id: T) {
    this.selected.push(id);

    this.updateFilters();
  }

  private unselect(id: T) {
    const idx = this.selected.indexOf(id);

    this.selected.splice(idx, 1);

    this.updateFilters();
  }

  private updateFilters() {
    if (!this.callback) { return; }

    this.callback(this.selected);
  }
}
