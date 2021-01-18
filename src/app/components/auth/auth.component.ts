import { Component, OnDestroy } from '@angular/core';
import { CustomCookieService } from '@core/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['../../shared/styles/auth.scss'],
})
export class AuthComponent implements OnDestroy {
  constructor(private customCookieService: CustomCookieService) { }

  ngOnDestroy() {
    this.customCookieService.setAuthChanged();
  }
}
