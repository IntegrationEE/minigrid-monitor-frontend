import { Component } from '@angular/core';
import { AppConst } from 'app/app.const';

@Component({
  selector: 'app-programme-indicators-panel',
  templateUrl: './programme-indicators-panel.component.html',
})
export class ProgrammeIndicatorsPanelComponent {
  parent: string = AppConst.MAIN_ROUTES.PROGRAMME_INDICATORS;
  current: string;
}
