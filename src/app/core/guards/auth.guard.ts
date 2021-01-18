import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthenticateService } from '@core/services';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private signUpUrl: string = `${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.SIGN_UP}`;

  constructor(private authService: AuthenticateService,
              private router: Router) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.authenticated()) {
      this.router.navigate([this.signUpUrl]);

      return false;
    }

    return true;
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.authenticated() || !this.authService.isAdmin()) {
      this.router.navigate([this.signUpUrl]);

      return false;
    }

    return true;
  }
}
