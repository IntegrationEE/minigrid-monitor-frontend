import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageHandler, Utils } from '@core/providers';
import { ThresholdsService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, HTTP } from '@shared/enums';
import { IModal, IThreshold } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-threshold-modal',
  templateUrl: './threshold-modal.component.html',
})
export class ThresholdModalComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  readonly actionType: typeof Action = Action;
  private changedData: boolean = false;

  constructor(public dialogRef: MatDialogRef<ThresholdModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IModal<IThreshold>,
              private service: ThresholdsService,
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
    if (this.form.valid) {
      this.loading = true;

      if (!this.changedData) {
        this.closeDialog(this.data.model, HTTP.PATCH, false);

        return;
      } else if (this.data.action === Action.EDIT) {
        this.data.model.min = this.form.value.min;
        this.data.model.max = this.form.value.max;

        this.service.update(this.data.model)
          .pipe(untilDestroyed(this), finalize(() => this.loading = false))
          .subscribe((response: IThreshold) => this.closeDialog(response, HTTP.PATCH));
      }
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: [{ value: this.data.model.name, disabled: true }, Validators.required],
      min: [this.data.model.min, [Validators.required, Validators.pattern(AppConst.REG_EXP.MIN_MAX_THRESHLODS)]],
      max: [this.data.model.max, [Validators.required, Validators.pattern(AppConst.REG_EXP.MIN_MAX_THRESHLODS)]],
    });

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.changedData = true);
  }

  private closeDialog(data: IThreshold, action: HTTP, showMessage: boolean = true) {
    if (showMessage) {
      this.messageHandler.handleInfo(action, 'Threshold');
    }
    this.dialogRef.close(data);
  }
}
