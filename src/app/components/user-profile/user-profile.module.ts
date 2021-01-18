import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbsModule } from '@shared/modules';
import { SharedModule } from '@shared/shared.module';

import { DetailsComponent } from './details/details.component';
import { PasswordComponent } from './password/password.component';
import { UserProfileRouter } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileServices } from './user-profile.services';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    UserProfileRouter,
    BreadcrumbsModule,
  ],
  declarations: [
    UserProfileComponent,
    DetailsComponent,
    PasswordComponent,
  ],
  providers: [UserProfileServices,
  ],
  entryComponents: [],
})
export class UserProfileModule { }
