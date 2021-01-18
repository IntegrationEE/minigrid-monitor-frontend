
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompaniesComponent } from './companies';
import { LocalGovernmentAreasComponent } from './local-government-areas';
import { ProgrammesComponent } from './programmes';
import { TablesComponent } from './tables.component';
import { TablesConst } from './tables.const';

const routes: Routes = [
  {
    path: '',
    component: TablesComponent,
    children: [
      {
        path: '',
        redirectTo: TablesConst.TABLES_ROUTES.COMPANIES,
      },
      {
        path: TablesConst.TABLES_ROUTES.COMPANIES,
        component: CompaniesComponent,
      },
      {
        path: TablesConst.TABLES_ROUTES.PROGRAMMES,
        component: ProgrammesComponent,
      },
      {
        path: TablesConst.TABLES_ROUTES.LGAS,
        component: LocalGovernmentAreasComponent,
      },
    ],
  },
];

export const TablesRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
