import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompanyUsersComponent } from './company-users.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyUsersComponent,
  },
];
export const CompanyUsersRouter: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
