import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticateService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class SitesGuard implements CanActivate {
  constructor(private authService: AuthenticateService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isDeveloper() || this.authService.isProgrammeManager();
  }
}
