import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService, CustomCookieService, SettingsService, SignInService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IAuth, ILogin } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../shared/styles/auth.scss'],
})
export class LoginComponent implements OnInit {
  loading: boolean;
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  forgotPasswordUrl: string = `/${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.FORGOT_PASSWORD}`;
  private model: ILogin = { username: '', password: '' };

  constructor(private signInService: SignInService,
              private customCookieService: CustomCookieService,
              private authenticateService: AuthenticateService,
              private settingsService: SettingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.customCookieService.deleteAll();
  }

  login(isGuest: boolean = false) {
    if (isGuest || !this.formIsInvalid()) {
      if (!isGuest) {
        this.initializeLogin();
      }

      this.loading = true;
      this.customCookieService.deleteAll();
      this.signInService.authentication(this.model, isGuest)
        .pipe(untilDestroyed(this), finalize(() => this.loading = false))
        .subscribe((auth: IAuth) => {
          this.finalizeAuth(auth);
        });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.code && event.code.toLowerCase() === 'enter' && !this.formIsInvalid()) {
      this.login();
    }
  }

  redirectToRegister() {
    this.router.navigate([`${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.SIGN_UP}`]);
  }

  private formIsInvalid(): boolean {
    for (const control in this.form.controls) {
      if (this.form.controls[control]) {
        this.form.controls[control].markAsTouched();
        this.form.controls[control].markAsDirty();
      }
    }

    return !this.form.valid && this.form.value;
  }

  private initializeLogin() {
    this.model.username = this.form.value.username;
    this.model.password = this.signInService.hashPassword(this.form.value.password);
  }

  private finalizeAuth(auth: IAuth) {
    this.customCookieService.storeAuth(auth);

    this.settingsService.getSettings()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.router.navigate([(this.authenticateService.getCompanyId() || this.authenticateService.isAnonymous()) ?
          `/${AppConst.MAIN_ROUTES.DASHBOARD}` :
          `/${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.WELCOME_PAGE}`,
        ]);
      });
  }
}
