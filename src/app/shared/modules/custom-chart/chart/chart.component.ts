import { Component, Input } from '@angular/core';
import { PluginServiceGlobalRegistrationAndOptions } from '@rinminase/ng-charts';

import { IChartConfig } from '../custom-chart.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['../chart-wrapper/chart-wrapper.component.scss'],
})
export class ChartComponent {
  @Input() config: IChartConfig;
  @Input() className: string;
  @Input() key: number;
  @Input() plugins: PluginServiceGlobalRegistrationAndOptions[];
}
