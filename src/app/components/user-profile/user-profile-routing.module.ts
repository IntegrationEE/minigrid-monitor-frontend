import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserProfileComponent } from './user-profile.component';
import { UserProfileConstants } from './user-profile.const';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    data: {
      breadcrumb: 'My account',
    },
    children: [
      {
        path: '',
        redirectTo: UserProfileConstants.ROUTES.MY_ACCOUNT,
        pathMatch: 'full',
      },
      {
        path: UserProfileConstants.ROUTES.MY_ACCOUNT,
        component: UserProfileComponent,
      },
    ],
  },
];
export const UserProfileRouter: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
