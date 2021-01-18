import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomTableModule } from '@shared/modules';
import { SharedModule } from '@shared/shared.module';

import * as Companies from './companies';
import * as LGA from './local-government-areas';
import * as Programmes from './programmes';
import { TablesRouting } from './tables-routing.module';
import { TablesComponent } from './tables.component';

@NgModule({
  imports: [
    CommonModule,
    TablesRouting,
    SharedModule,
    CustomTableModule,
  ],
  declarations: [
    TablesComponent,
    Programmes.ProgrammesComponent,
    Programmes.ProgrammeModalComponent,
    Companies.CompaniesComponent,
    Companies.CompanyModalComponent,
    LGA.LocalGovernmentAreaModalComponent,
    LGA.LocalGovernmentAreasComponent,
  ],
  providers: [
    Programmes.ProgrammeManageService,
    Companies.CompanyManageService,
    LGA.LocalGovernmentAreaManageService,
  ],
  entryComponents: [
    LGA.LocalGovernmentAreaModalComponent,
    Companies.CompanyModalComponent,
    Programmes.ProgrammeModalComponent,
  ],
})
export class TablesModule {
}
