import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomCookieService, EnumService, ProgrammeService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, ColumnType, RoleCode, SettingsCode } from '@shared/enums';
import { IEnum, IUser } from '@shared/interfaces';
import { CustomTableConst, CustomTableService, ITableAction, ITableColumn, ITableConfig } from '@shared/modules';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { ApproveModalComponent } from './approve-modal';
import { UserModalComponent } from './user-modal';
import { UserTable } from './users.const';
import { UserService } from './users.service';

@UntilDestroy()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  config: ITableConfig = {
    table: CustomTableConst.TABLES.USERS,
    actions: {
      delete: true,
      edit: (element: IUser) => element.role !== RoleCode.GUEST,
      customs: [{
        enabled: (element: IUser) => element.role === RoleCode.GUEST,
        label: 'Approve',
        action: (id: number) => {
          this.openApproveDialog(id);
        },
      }],
      create: false,
    },
    columns: [
      { name: UserTable.COLUMNS.FULL_NAME, title: 'Full Name', searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: UserTable.COLUMNS.EMAIL, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: UserTable.COLUMNS.LOGIN, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: UserTable.COLUMNS.COMPANY, searchable: true, sortable: true, type: ColumnType.GENERIC },
      { name: UserTable.COLUMNS.ROLE, title: 'Role', searchable: true, sortable: true, type: ColumnType.CUSTOM },
      { name: UserTable.COLUMNS.HEAD_OF_COMPANY, title: 'Head of Company', searchable: true, sortable: true, type: ColumnType.CHECK },
      { name: UserTable.COLUMNS.ACTIONS, type: ColumnType.ACTIONS },
    ],
  };
  organisationLabel: string;
  private roles: IEnum<RoleCode>[] = [];

  constructor(private service: UserService,
              private roleService: EnumService,
              private tableServie: CustomTableService<IUser>,
              private programmeService: ProgrammeService,
              private customCookieService: CustomCookieService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.fetchData();
    this.organisationLabel = this.customCookieService.get(SettingsCode[SettingsCode.ORGANISATION_LABEL]);
    this.config.columns.find((column: ITableColumn) => column.name === UserTable.COLUMNS.COMPANY).title = this.organisationLabel;
  }

  openDialog(tableAction: ITableAction<IUser>) {
    switch (tableAction.action) {
      case Action.EDIT:
        this.service.get(tableAction.model.id)
          .pipe(untilDestroyed(this))
          .subscribe((response: IUser) => {
            this.initDialog(response, tableAction.action);
          });
        break;
      case Action.DELETE:
        this.initDialog(tableAction.model ? { ...tableAction.model } : {} as IUser, tableAction.action);
        break;
    }
  }

  private initDialog(model: IUser, action: Action) {
    this.dialog
      .open(UserModalComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          action,
          model,
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: IUser) => {
        if (result) {
          const selectedRole: IEnum<RoleCode> = this.getRole(result.role);

          this.tableServie.updateRow({ model: { ...result, roleName: selectedRole.label }, action });
        }
      });
  }

  private openApproveDialog(id: number) {
    this.service.get(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: IUser) => {
        this.approveDialog(response);
      });
  }

  private approveDialog(model: IUser) {
    this.dialog
      .open(ApproveModalComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          id: model.id,
          email: model.email,
          fullName: model.fullName,
          role: model.role,
        } as IUser,
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((user: IUser) => {
        if (user) {
          const selectedRole: IEnum<RoleCode> = this.getRole(user.role);

          this.tableServie.updateRow(
            {
              model: { ...model, role: selectedRole.value, roleName: selectedRole.label, isHeadOfCompany: user.isHeadOfCompany },
              action: Action.EDIT,
            },
          );
        }
      });
  }

  private fetchData() {
    this.tableServie.setLoading(true);
    this.roles = this.roleService.getRolesValue();
    if (!this.roles) {
      this.roleService.getRoles()
        .pipe(untilDestroyed(this))
        .subscribe((roles: IEnum<RoleCode>[]) => this.roles = roles);
    }

    if (!this.programmeService.getListValue()) {
      this.programmeService.getAll()
        .pipe(untilDestroyed(this))
        .subscribe();
    }

    this.service.getAll()
      .pipe(untilDestroyed(this), finalize(() => this.tableServie.setLoading(false)))
      .subscribe((data: IUser[]) => {
        this.tableServie.setRows(data);
      });
  }

  private getRole(roleCode: RoleCode): IEnum<RoleCode> {
    return this.roles.find((role: IEnum<RoleCode>) => {
      return role.value === roleCode;
    });
  }
}
