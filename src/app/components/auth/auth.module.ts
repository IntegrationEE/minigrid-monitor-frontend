import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { ConfirmEmailComponent } from './confirm-email';
import { ConfirmSignUpComponent } from './confirm-sign-up';
import { ForgotPasswordComponent } from './forgot-password';
import { LogOutComponent } from './log-out';
import { SetPasswordComponent } from './set-password';
import * as SignUp from './sign-up';
import { WelcomePageComponent } from './welcome-page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    SignUp.SignUpComponent,
    SignUp.RegisterComponent,
    SignUp.LoginComponent,
    SetPasswordComponent,
    AuthComponent,
    ConfirmEmailComponent,
    ConfirmSignUpComponent,
    ForgotPasswordComponent,
    WelcomePageComponent,
    LogOutComponent,
  ],
  providers: [
    AuthService,
  ],
  entryComponents: [],
})
export class AuthModule { }
