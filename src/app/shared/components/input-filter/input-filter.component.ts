import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.scss'],
})
export class InputFilterComponent implements OnInit {
  @Input() placeholder: string;
  @Output() onValueChange: EventEmitter<string> = new EventEmitter();
  filterControl: FormControl;
  magnifierIconUrl: string = AppConst.ICONS.magnifier;
  hideClear: boolean = true;

  ngOnInit() {
    this.filterControl = new FormControl();

    this.filterControl.valueChanges
      .pipe(untilDestroyed(this), distinctUntilChanged(), debounceTime(1000))
      .subscribe((filter: string) => {
        this.hideClear = !filter.length;
        this.onValueChange.next(filter ? filter.toLowerCase() : '');
      });
  }

  clearFilter() {
    this.filterControl.setValue('');
  }
}
