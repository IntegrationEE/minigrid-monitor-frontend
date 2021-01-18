import { Component } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { MessageHandler } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';

@UntilDestroy()
@Component({
  selector: 'app-confirm-sign-up',
  templateUrl: './confirm-sign-up.component.html',
  styleUrls: ['../../../shared/styles/auth.scss'],
})
export class ConfirmSignUpComponent {
  loading: boolean = true;
  readonly routes = AppConst.MAIN_ROUTES;

  constructor(private authService: AuthService,
              private messageHandler: MessageHandler) {
  }

  sendAgain() {
    this.authService.sendEmailAgain(this.authService.getRegisteredUser())
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.messageHandler.handleMessageInfo('Please check your inbox');
      });
  }
}
