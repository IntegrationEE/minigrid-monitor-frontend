import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminConst } from './admin.const';

// tslint:disable: typedef
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: AdminConst.ADMIN_ROUTES.MAIN,
        pathMatch: 'full',
      },
      {
        path: AdminConst.ADMIN_ROUTES.MAIN,
        loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
      },
      {
        path: AdminConst.ADMIN_ROUTES.TABLES,
        loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule),
      },
    ],
  },
];

export const AdminRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
