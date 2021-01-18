import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageHandler } from '@core/providers';
import { AppConst } from 'app/app.const';
import { ChangeContext, Options, PointerType } from 'ng5-slider';

import { HeaderConst } from '../header.const';

@Component({
  selector: 'app-header-slider',
  templateUrl: './header-slider.component.html',
  styleUrls: ['../header.component.scss', './header-slider.component.scss'],
})
export class HeaderSliderComponent {
  @Input() set setMinFrom(min: number) {
    this.options = { ...this.options, floor: min };
    this.from = min;
  }
  @Input() set setMaxTo(max: number) {
    this.options = { ...this.options, ceil: max };
    this.to = max;
  }
  @Input() set setDisabled(flag: boolean) {
    this.options = { ...this.options, disabled: flag };
    this.isGuest = flag;
  }
  @Input() set setFrom(from: number) {
    this.from = from;
  }
  @Input() set setTo(to: number) {
    this.to = to;
  }
  @Output() fromChange: EventEmitter<number> = new EventEmitter();
  @Output() toChange: EventEmitter<number> = new EventEmitter();

  from: number = 0;
  to: number = 0;
  isGuest: boolean;
  options: Options = {
    floor: 0,
    ceil: 1000,
    disabled: false,
    hideLimitLabels: false,
    hidePointerLabels: false,
    getTickColor: (): string => AppConst.CHART_COLORS.GREEN,
    getSelectionBarColor: (): string => AppConst.CHART_COLORS.GREEN,
    getPointerColor: (): string => AppConst.CHART_COLORS.GREEN,
    translate: (value: number): string => {
      return value + ' kW';
    },
  };

  constructor(private messageHandler: MessageHandler) { }

  checkIsGuest() {
    if (this.isGuest) {
      this.messageHandler.handleMessageInfo(HeaderConst.LABELS.DISABLED_FILTERS);
    }
  }

  onChange(context: ChangeContext) {
    if (context.pointerType === PointerType.Min) {
      this.fromChange.next(context.value);
    } else {
      this.toChange.next(context.highValue);
    }
  }
}
