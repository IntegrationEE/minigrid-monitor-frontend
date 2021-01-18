import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { CompanyUsersRouter } from './company-users-routing.module';
import { CompanyUsersComponent } from './company-users.component';
import { CompanyUsersService } from './company-users.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CompanyUsersRouter,
  ],
  declarations: [
    CompanyUsersComponent,
  ],
  providers: [
    CompanyUsersService,
  ],
})
export class CompanyUsersModule { }
