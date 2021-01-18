import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { MessageHandler } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomErrorStateMatcher } from '@shared/classes';
import { AppConst } from 'app/app.const';
import * as Encryptor from 'sha256';

import { ISetPassword } from './set-password.interface';

@UntilDestroy()
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['../../../shared/styles/auth.scss'],
})
export class SetPasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmpassword: new FormControl(''),
  }, this.checkPasswords);
  matcher = new CustomErrorStateMatcher();
  private token: string;

  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private messageHandler: MessageHandler) {
  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      this.token = params['param'];
    });
  }

  submitPassword() {
    const encryptedPass: string = Encryptor(this.form.value.password);
    const passwordModel: ISetPassword = {
      encryptedPassword: encryptedPass,
      passwordToken: this.token,
    };

    this.authService.resetPassword(passwordModel)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.messageHandler.handleMessageInfo('Password set successfully');
        this.router.navigate([AppConst.MAIN_ROUTES.SIGN_UP]);
      });
  }

  private checkPasswords(c: AbstractControl): { notSame: boolean } {
    if (c.get('password').value !== c.get('confirmpassword').value) {
      return { notSame: true };
    }
  }
}
