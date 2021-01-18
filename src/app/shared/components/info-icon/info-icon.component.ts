import { Component, Input } from '@angular/core';
import { AppConst } from 'app/app.const';

@Component({
  selector: 'app-info-icon',
  templateUrl: './info-icon.component.html',
})
export class InfoIconComponent {
  @Input() tooltip: string;
  readonly icon: string = AppConst.ICONS.info;
}
