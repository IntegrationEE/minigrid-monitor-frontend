
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChartConfigurationsComponent } from './chart-configurations';
import { IntegrationsComponent } from './integrations';
import { MainComponent } from './main.component';
import { MainConst } from './main.const';
import { ThresholdsComponent } from './thresholds';
import { UsersComponent } from './users';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: MainConst.MAIN_ROUTES.USERS,
      },
      {
        path: MainConst.MAIN_ROUTES.USERS,
        component: UsersComponent,
      },
      {
        path: MainConst.MAIN_ROUTES.THRESHOLDS,
        component: ThresholdsComponent,
      },
      {
        path: MainConst.MAIN_ROUTES.CHART_CONFIGURATIONS,
        component: ChartConfigurationsComponent,
      },
      {
        path: MainConst.MAIN_ROUTES.INTEGRATIONS,
        component: IntegrationsComponent,
      },
    ],
  },
];

export const MainRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
