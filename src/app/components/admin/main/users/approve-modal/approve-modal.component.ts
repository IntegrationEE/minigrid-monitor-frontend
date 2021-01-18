import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageHandler } from '@core/providers';
import { EnumService, ProgrammeService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RoleCode } from '@shared/enums';
import { IEnum, ILight, IUser } from '@shared/interfaces';
import { finalize } from 'rxjs/operators';

import { UserService } from '../users.service';

@UntilDestroy()
@Component({
  selector: 'app-approve-modal',
  templateUrl: './approve-modal.component.html',
})
export class ApproveModalComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  companies: ILight[] = [];
  roles: IEnum<RoleCode>[] = [];
  programmes: ILight[] = [];
  readonly roleCodes: typeof RoleCode = RoleCode;

  constructor(public dialogRef: MatDialogRef<ApproveModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IUser,
              private service: UserService,
              private messageHandler: MessageHandler,
              private formBuilder: FormBuilder,
              private programmeService: ProgrammeService,
              private roleService: EnumService) {
  }

  ngOnInit() {
    this.initForm();
    this.fetchData();
  }

  onConfirm() {
    if (this.form.valid && this.form.value.role !== RoleCode.GUEST) {
      this.loading = true;
      this.service.approve(this.data.id, this.form.value)
        .pipe(untilDestroyed(this), finalize(() => this.loading = false))
        .subscribe(() => {
          this.messageHandler.handleMessageInfo('Account was approved');
          this.dialogRef.close(this.form.value);
        });
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      email: [this.data.email],
      fullName: [this.data.fullName],
      role: [this.data.role, Validators.required],
      programmes: [null],
      isHeadOfCompany: [false],
    });

    this.form.get('email').disable();
    this.form.get('fullName').disable();
  }

  private fetchData() {
    this.roles = this.roleService.getRolesValue();
    this.programmes = this.programmeService.getListValue();
  }
}
