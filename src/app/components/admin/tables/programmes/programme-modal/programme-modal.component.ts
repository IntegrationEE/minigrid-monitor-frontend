import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageHandler, Utils } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, HTTP } from '@shared/enums';
import { ILight, IModal } from '@shared/interfaces';
import { finalize } from 'rxjs/operators';

import { ProgrammeManageService } from '../programmes.service';

@UntilDestroy()
@Component({
  selector: 'app-programme-modal',
  templateUrl: './programme-modal.component.html',
})
export class ProgrammeModalComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  readonly actionType: typeof Action = Action;
  private changedData: boolean = false;

  constructor(public dialogRef: MatDialogRef<ProgrammeModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IModal<ILight>,
              private service: ProgrammeManageService,
              private messageHandler: MessageHandler,
              private utils: Utils,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (this.data.action !== Action.DELETE) {
      this.initForm();
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
        this.data.model.name = this.form.value.name;
      }

      switch (this.data.action) {
        case Action.CREATE:
          this.service.create(this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: ILight) => this.closeDialog(response, HTTP.POST));
          break;
        case Action.EDIT:
          this.service.update(this.data.model.id, this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: ILight) => this.closeDialog(response, HTTP.PATCH));
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
      name: [this.data.model.name, Validators.required],
    });

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.changedData = true);
  }

  private closeDialog(data: ILight, action: HTTP, showMessage: boolean = true) {
    if (showMessage) {
      this.messageHandler.handleInfo(action, 'Programme');
    }
    this.dialogRef.close(data);
  }
}
