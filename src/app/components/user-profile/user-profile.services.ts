import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppConst } from 'app/app.const';
import { Observable } from 'rxjs';

import { IChangePasswordModel, IUserDetailsModel, IUserDetailsUpdateModel } from './user-profile.interface';

@Injectable()
export class UserProfileServices {
  private readonly baseUrl: string = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<IUserDetailsModel> {
    return this.http.get<IUserDetailsModel>(`${this.baseUrl}${AppConst.REQUESTS_URL.USERS}${AppConst.REQUESTS_URL.CURRENT}`);
  }

  updateCurrentUser(data: IUserDetailsUpdateModel): Observable<IUserDetailsUpdateModel> {
    return this.http.patch<IUserDetailsUpdateModel>(`${this.baseUrl}${AppConst.REQUESTS_URL.USERS}${AppConst.REQUESTS_URL.CURRENT}`, data);
  }

  changePassword(data: IChangePasswordModel): Observable<IChangePasswordModel> {
    return this.http.patch<IChangePasswordModel>(`${this.baseUrl}${AppConst.REQUESTS_URL.USERS}${AppConst.REQUESTS_URL.PASSWORD}`, data);
  }
}
