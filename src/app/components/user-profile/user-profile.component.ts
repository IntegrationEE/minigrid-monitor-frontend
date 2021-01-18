import { Component } from '@angular/core';
import { AppConst } from 'app/app.const';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  parent: string = AppConst.MAIN_ROUTES.USER_PROFILE;
}
