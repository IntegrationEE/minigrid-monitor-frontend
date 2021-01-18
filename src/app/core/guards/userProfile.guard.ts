import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticateService } from '@core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileGuard implements CanActivate {
  constructor(private authService: AuthenticateService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.authService.isGuest();
  }
}
