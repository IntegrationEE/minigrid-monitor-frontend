import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageHandler, Utils } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, HTTP } from '@shared/enums';
import { IModal } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { IIntegration, IIntegrationStep } from '../integrations.interface';
import { IntegrationsService } from '../integrations.service';

@UntilDestroy()
@Component({
  selector: 'app-integration-modal',
  templateUrl: './integration-modal.component.html',
  styleUrls: ['./integration-modal.component.scss'],
})
export class IntegrationModalComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  readonly icons = AppConst.ICONS;
  readonly actionType: typeof Action = Action;
  private changedData: boolean = false;

  constructor(public dialogRef: MatDialogRef<IntegrationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IModal<IIntegration>,
              private service: IntegrationsService,
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

  addStep() {
    if (this.data.model.steps && this.data.model.steps.length > 0) {
      const checkLastStep: string = this.data.model.steps[this.data.model.steps.length - 1].name;

      if (!checkLastStep) {
        this.messageHandler.handleMessageInfo('Complete the previous steps before adding another one.');

        return;
      }
    }

    const step: IIntegrationStep = {
      ordinal: this.data.model.steps.length + 1,
      timestamp: new Date().getTime(),
    } as IIntegrationStep;

    if (this.data.model && this.data.model.steps) {
      this.data.model.steps.push(step);
    } else {
      this.data.model.steps = [step];
    }

    this.addStepControls(step);
  }

  removeStep(index: number) {
    const timestamp: number = this.data.model.steps[index].timestamp;

    this.data.model.steps.splice(index, 1);
    this.form.removeControl(`step_${timestamp}_name`);
    this.form.removeControl(`step_${timestamp}_function`);
  }

  onConfirm() {
    if (this.data.action === Action.DELETE || this.form.valid) {
      this.loading = true;

      if (!this.changedData && this.data.action !== Action.DELETE) {
        this.closeDialog(this.data.model, HTTP.PATCH, false);

        return;
      } else if (this.data.action !== Action.DELETE) {
        this.data.model = { ...this.form.value, id: this.data.model.id, steps: this.data.model.steps };
      }

      switch (this.data.action) {
        case Action.CREATE:
          this.service.create(this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: IIntegration) => this.closeDialog(response, HTTP.POST));
          break;
        case Action.EDIT:
          this.service.update(this.data.model.id, this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: IIntegration) => this.closeDialog(response, HTTP.PATCH));
          break;
        case Action.DELETE:
          this.service.delete(this.data.model.id)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe(() => this.closeDialog(this.data.model, HTTP.DELETE));
          break;
      }
    }
  }

  private addStepControls(currentStep: IIntegrationStep) {
    this.form.addControl(`step_${currentStep.timestamp}_name`, new FormControl(currentStep.name, [Validators.required]));
    this.form.addControl(`step_${currentStep.timestamp}_function`,
      new FormControl(currentStep.function, [Validators.required, Validators.pattern(AppConst.REG_EXP.NO_WHITE_SPACE)]));

    this.form.get(`step_${currentStep.timestamp}_name`).valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((name: string) => currentStep.name = name);

    this.form.get(`step_${currentStep.timestamp}_function`).valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((functionName: string) => currentStep.function = functionName);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: [this.data.model.name, Validators.required],
      token: [this.data.model.token, Validators.required],
      questionHash: [this.data.model.questionHash, Validators.required],
      interval: [this.data.model.interval, Validators.required],
      isActive: [this.data.model.isActive],
      steps: [this.data.model.steps, Validators.required],
    });

    if (this.data.model && this.data.model.steps && this.data.model.steps.length) {
      this.data.model.steps.forEach((step: IIntegrationStep, index: number) => {
        step.timestamp = index;
        this.addStepControls(step);
      });
    }

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.changedData = true);
  }

  private closeDialog(data: IIntegration, action: HTTP, showMessage: boolean = true) {
    if (showMessage) {
      this.messageHandler.handleInfo(action, 'Integration');
    }
    this.dialogRef.close(data);
  }
}
