import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as Auth from '@auth/.';
import * as Guards from '@core/guards';
import { MapResolver, ThresholdsResolver } from '@core/resolvers';
import { PageNotFoundComponent } from '@shared/components';
import { AppConst } from 'app/app.const';

// tslint:disable: typedef
const routes: Routes = [
  {
    path: '',
    redirectTo: `${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.SIGN_UP}`,
    pathMatch: 'full',
  },
  {
    path: AppConst.MAIN_ROUTES.SIGN_UP,
    redirectTo: `${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.SIGN_UP}`,
    pathMatch: 'full',
  },
  {
    path: AppConst.MAIN_ROUTES.AUTH, component: Auth.AuthComponent, children: [
      {
        path: AppConst.MAIN_ROUTES.SIGN_UP,
        component: Auth.SignUpComponent,
      },
      {
        path: AppConst.MAIN_ROUTES.CONFIRM_SIGN_UP,
        component: Auth.ConfirmSignUpComponent,
      },
      {
        path: AppConst.MAIN_ROUTES.CONFIRM_EMAIL + AppConst.MAIN_ROUTES.PARAM,
        component: Auth.ConfirmEmailComponent,
      },
      {
        path: AppConst.MAIN_ROUTES.RESET_PASSWORD + AppConst.MAIN_ROUTES.PARAM,
        component: Auth.SetPasswordComponent,
      },
      {
        path: AppConst.MAIN_ROUTES.FORGOT_PASSWORD,
        component: Auth.ForgotPasswordComponent,
      },
      {
        path: AppConst.MAIN_ROUTES.WELCOME_PAGE,
        component: Auth.WelcomePageComponent,
        canActivate: [Guards.AuthGuard],
      },
      {
        path: AppConst.MAIN_ROUTES.LOG_OUT,
        component: Auth.LogOutComponent,
      },
    ],
  },
  {
    path: AppConst.MAIN_ROUTES.DASHBOARD,
    canActivate: [Guards.AuthGuard],
    loadChildren: () => import('./components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    pathMatch: 'full',
    resolve: [MapResolver],
  },
  {
    path: AppConst.MAIN_ROUTES.ADMIN,
    canActivate: [Guards.AdminGuard],
    canDeactivate: [Guards.ClearGuard],
    loadChildren: () => import('./components/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: AppConst.MAIN_ROUTES.SITES + AppConst.MAIN_ROUTES.PARAM,
    redirectTo: AppConst.MAIN_ROUTES.SITES,
    pathMatch: 'full',
  },
  {
    path: AppConst.MAIN_ROUTES.SITES,
    canActivate: [Guards.SitesGuard],
    canDeactivate: [Guards.ClearGuard],
    loadChildren: () => import('./components/site-panel/site-panel.module').then((m) => m.SitePanelModule),
    resolve: [MapResolver, ThresholdsResolver],
  },
  {
    path: AppConst.MAIN_ROUTES.PROGRAMME_INDICATORS + AppConst.MAIN_ROUTES.PARAM,
    redirectTo: AppConst.MAIN_ROUTES.PROGRAMME_INDICATORS,
    pathMatch: 'full',
  },
  {
    path: AppConst.MAIN_ROUTES.PROGRAMME_INDICATORS,
    canActivate: [Guards.ProgrammeIndicatorsGuard],
    canDeactivate: [Guards.ClearGuard],
    loadChildren: () => import('./components/programme-indicators-panel/programme-indicators-panel.module')
      .then((m) => m.ProgrammeIndicatorsPanelModule),
  },
  {
    path: AppConst.MAIN_ROUTES.USER_PROFILE,
    canActivate: [Guards.UserProfileGuard],
    loadChildren: () => import('./components/user-profile/user-profile.module').then((m) => m.UserProfileModule),
  },
  {
    path: AppConst.MAIN_ROUTES.COMPANY_USERS,
    canActivate: [Guards.CompanyUsersGuard],
    loadChildren: () => import('./components/company-users/company-users.module').then((m) => m.CompanyUsersModule),
  },
  {
    path: AppConst.MAIN_ROUTES.PAGE_NOT_FOUND,
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: AppConst.MAIN_ROUTES.PAGE_NOT_FOUND,
  },
];
export const ModuleRouting: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes, { useHash: true, enableTracing: false });
