import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];
export const DashboardRouter: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
