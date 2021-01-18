import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';

@UntilDestroy()
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../../../shared/styles/auth.scss'],
})
export class RegisterComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private authService: AuthService,
              private router: Router) {
  }

  requestAccount() {
    this.authService.register(this.form.value)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.router.navigate([`/${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.CONFIRM_SIGN_UP}`]));
  }
}
