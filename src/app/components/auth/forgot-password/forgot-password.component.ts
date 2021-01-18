import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../../shared/styles/auth.scss'],
})
export class ForgotPasswordComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  loading: boolean;
  notification: boolean;
  readonly routes = AppConst.MAIN_ROUTES;

  constructor(private authService: AuthService) { }

  resetPassword() {
    this.loading = true;
    this.authService.forgotPassword(this.form.value.email)
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe(() => this.notification = true);
  }
}
