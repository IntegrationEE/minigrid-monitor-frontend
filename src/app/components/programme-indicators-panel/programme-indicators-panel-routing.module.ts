import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProgrammeIndicatorsPanelComponent } from './programme-indicators-panel.component';

const routes: Routes = [
  {
    path: '',
    component: ProgrammeIndicatorsPanelComponent,
    data: {
      breadcrumb: 'My programmes indicators',
    },
  },
];
export const ProgrammeIndicatorsPanelRouter: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
