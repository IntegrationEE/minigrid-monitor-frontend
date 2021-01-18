import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageHandler, Utils } from '@core/providers';
import { CompanyService, CustomCookieService, EnumService, ProgrammeService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, HTTP, RoleCode, SettingsCode } from '@shared/enums';
import { IEnum, ILight, IModal, IUser } from '@shared/interfaces';
import { finalize } from 'rxjs/operators';

import { UserService } from '../users.service';

@UntilDestroy()
@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
})
export class UserModalComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  companies: ILight[] = [];
  programmes: ILight[] = [];
  roles: IEnum<RoleCode>[] = [];
  organisationLabel: string;
  readonly actionType: typeof Action = Action;
  readonly roleCodes: typeof RoleCode = RoleCode;
  private changedData: boolean = false;

  constructor(public dialogRef: MatDialogRef<UserModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IModal<IUser>,
              private service: UserService,
              private messageHandler: MessageHandler,
              private utils: Utils,
              private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private programmeService: ProgrammeService,
              private customCookieService: CustomCookieService,
              private roleService: EnumService) {
  }

  ngOnInit() {
    this.organisationLabel = this.customCookieService.get(SettingsCode[SettingsCode.ORGANISATION_LABEL]);

    if (this.data.action !== Action.DELETE) {
      this.initForm();
      this.fetchData();
    }
  }

  capitalize(content: Action): string {
    return this.utils.getActionName(content);
  }

  onConfirm() {
    if (this.data.action === Action.DELETE || this.form.valid) {
      this.loading = true;

      if (!this.changedData && this.data.action !== Action.DELETE) {
        this.closeDialog(this.data.model, HTTP.PATCH, false);

        return;
      } else if (this.data.action !== Action.DELETE) {
        this.data.model = { ...this.form.value, id: this.data.model.id };
      }

      switch (this.data.action) {
        case Action.CREATE:
          this.service.create(this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: IUser) => this.closeDialog(response, HTTP.POST));
          break;
        case Action.EDIT:
          this.service.update(this.data.model.id, this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: IUser) => this.closeDialog(response, HTTP.PATCH));
          break;
        case Action.DELETE:
          this.service.delete(this.data.model.id)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe(() => this.closeDialog(this.data.model, HTTP.DELETE));
          break;
      }
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      companyId: [this.data.model.companyId, Validators.required],
      email: [this.data.model.email, [Validators.required, Validators.email]],
      fullName: [this.data.model.fullName, Validators.required],
      login: [this.data.model.login, Validators.required],
      role: [this.data.model.role, Validators.required],
      programmes: [this.data.model.programmes],
      isHeadOfCompany: [this.data.model.isHeadOfCompany],
    });

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.changedData = true);
  }

  private closeDialog(data: IUser, action: HTTP, showMessage: boolean = true) {
    if (showMessage) {
      this.messageHandler.handleInfo(action, 'User');
    }
    this.dialogRef.close(data);
  }

  private fetchData() {
    if (this.companyService.getListValue()) {
      this.companies = this.companyService.getListValue();
    } else {
      this.companyService.getList()
        .pipe(untilDestroyed(this))
        .subscribe((response: ILight[]) => {
          this.companies = response;
        });
    }

    this.programmes = this.programmeService.getListValue();
    this.roles = this.roleService.getRolesValue();
  }
}
