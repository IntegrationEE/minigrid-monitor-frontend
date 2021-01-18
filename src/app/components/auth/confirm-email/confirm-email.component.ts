import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['../../../shared/styles/auth.scss'],
})
export class ConfirmEmailComponent implements OnInit {
  loading: boolean = true;
  isConfirmed: boolean = false;
  readonly routes = AppConst.MAIN_ROUTES;
  private token: string;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loading = true;
    this.route.params
      .pipe(untilDestroyed(this))
      .subscribe((params: Params) => {
        this.token = params['param'];
        this.authService.confirmEmail(this.token)
          .pipe(untilDestroyed(this), finalize(() => this.loading = false))
          .subscribe(() => {
            this.isConfirmed = true;
          });
      });
  }
}
