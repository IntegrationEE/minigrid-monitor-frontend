import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageHandler } from '@core/providers';
import { AuthenticateService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmActionDialogComponent } from '@shared/components';
import { RoleCode } from '@shared/enums';
import { AppConst } from 'app/app.const';

import { CompanyUsersTable } from './company-users.const';
import { ICompanyUsers } from './company-users.interface';
import { CompanyUsersService } from './company-users.service';

@UntilDestroy()
@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
})
export class CompanyUsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<ICompanyUsers> = new MatTableDataSource();
  currentUserId: number;
  countHeadOfCompany: number;
  readonly columns = CompanyUsersTable.COLUMNS;
  readonly rolesCodes: typeof RoleCode = RoleCode;
  readonly displayedColumns: string[] = [
    CompanyUsersTable.COLUMNS.FULL_NAME,
    CompanyUsersTable.COLUMNS.EMAIL,
    CompanyUsersTable.COLUMNS.LOGIN,
    CompanyUsersTable.COLUMNS.HEAD_OF_COMPANY,
    CompanyUsersTable.COLUMNS.ACTIONS,
  ];
  private readonly logOutUrl: string = `${AppConst.MAIN_ROUTES.AUTH}/${AppConst.MAIN_ROUTES.LOG_OUT}`;

  constructor(private service: CompanyUsersService,
              private authService: AuthenticateService,
              private messageHandler: MessageHandler,
              private dialog: MatDialog,
              private router: Router) {
    this.currentUserId = this.authService.getUserId();
  }

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  approve(model: ICompanyUsers) {
    this.service.approve(model.id)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.messageHandler.handleMessageInfo('The user has been approved');
        this.fetchData();
      });
  }

  delete(model: ICompanyUsers, action: string) {
    this.dialog
      .open(ConfirmActionDialogComponent, {
        width: AppConst.MODAL_SIZES.MEDIUM,
        data: {
          title: action[0].toUpperCase() + action.slice(1) + ' User',
          cancel: 'Cancel',
          action: 'Confirm',
          message: 'Are you sure to ' + action + ' this user: ' + model.fullName + '?',
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: boolean) => {
        if (result) {
          this.service.delete(model.id)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.messageHandler.handleMessageInfo('The user has been deleted');
              this.fetchData();
            });
        }
      });
  }

  toggleHeadOfCompany(model: ICompanyUsers) {
    const currentUserId: number = this.authService.getUserId();

    this.service.toggleHeadOfCompany(model.id)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (currentUserId === model.id) {
          this.messageHandler.handleMessageInfo('The flag: "Head Of Company" has been changed. You have been logged out.');
          this.logout();
        } else {
          this.messageHandler.handleMessageInfo('The flag: "Head Of Company" has been changed.');
          this.fetchData();
        }
      });
  }

  private fetchData() {
    this.service.getAll()
      .pipe(untilDestroyed(this))
      .subscribe((data: ICompanyUsers[]) => {
        this.dataSource.data = data;
        this.countHeadOfCompany = data.filter((user: ICompanyUsers) => user.isHeadOfCompany).length;
        this.dataSource._updateChangeSubscription();
      });
  }

  private logout() {
    this.router.navigate([this.logOutUrl]);
  }
}
