import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticateService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthenticateService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAdmin();
  }
}
