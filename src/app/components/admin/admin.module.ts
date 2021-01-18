import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { AdminRouting } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SideMenuComponent } from './side-menu';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    AdminRouting,
  ],
  declarations: [
    AdminComponent,
    SideMenuComponent,
    SideMenuComponent,
  ],
  entryComponents: [],
})
export class AdminModule { }
