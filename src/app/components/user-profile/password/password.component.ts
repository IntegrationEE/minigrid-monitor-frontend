import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageHandler } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomErrorStateMatcher } from '@shared/classes';
import * as Encryptor from 'sha256';

import { IChangePasswordModel } from '../user-profile.interface';
import { UserProfileServices } from '../user-profile.services';

@UntilDestroy()
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['../user-profile.component.scss'],
})

export class PasswordComponent {
  changePasswordForm: FormGroup = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmNewPassword: new FormControl(''),
  }, this.passwordMatcher);
  matcher = new CustomErrorStateMatcher();

  constructor(private userProfileServices: UserProfileServices,
              private messageHandler: MessageHandler) {
  }

  updatePassword() {
    const encryptedCurrentPass: string = Encryptor(this.changePasswordForm.value.currentPassword);
    const encryptedNewPass: string = Encryptor(this.changePasswordForm.value.newPassword);

    const changePasswordModel: IChangePasswordModel = {
      newPassword: encryptedNewPass,
      currentPassword: encryptedCurrentPass,
    };

    this.userProfileServices.changePassword(changePasswordModel)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.messageHandler.handleMessageInfo('The password has been changed');
      });
  }

  private passwordMatcher(control: AbstractControl): { notSame: boolean } {
    if (control.get('newPassword').value !== control.get('confirmNewPassword').value) {
      return { notSame: true };
    }
  }
}
