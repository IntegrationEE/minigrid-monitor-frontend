import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SitePanelComponent } from './site-panel.component';

const routes: Routes = [
  {
    path: '',
    component: SitePanelComponent,
    data: {
      breadcrumb: 'My sites',
    },
  },
];
export const SitePanelRouter: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
