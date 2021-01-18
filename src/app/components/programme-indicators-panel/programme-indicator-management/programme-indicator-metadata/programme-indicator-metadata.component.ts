import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageHandler } from '@core/providers';
import { ValidationService } from '@core/services';
import { MyProgrammeIndicatorsService } from '@indicators/my-programme-indicators/my-programme-indicators.services';
import { CurrentIndicatorService } from '@indicators/programme-indicator-management/programme-indicator-management.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProgrammeIndicator } from '../programme-indicator-management.interface';

import { ProgrammeIndicatorMetadataConst } from './programme-indicator-metadata.const';

@UntilDestroy()
@Component({
  selector: 'app-programme-indicator-metadata',
  templateUrl: './programme-indicator-metadata.component.html',
})
export class ProgrammeIndicatorMetadataComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  readonly tooltips = ProgrammeIndicatorMetadataConst.TOOLTIPS;

  constructor(private formBuilder: FormBuilder,
              private messageHandler: MessageHandler,
              private currentIndicatorService: CurrentIndicatorService,
              private myProgrammeIndicatorsService: MyProgrammeIndicatorsService,
              private validationService: ValidationService) {
  }

  ngOnInit() {
    this.initForm(this.currentIndicatorService.getValue());
  }

  hasError(controlName: string): boolean {
    return this.validationService.hasError(this.form, controlName);
  }

  getError(controlName: string): string {
    return this.validationService.getError(this.form, controlName);
  }

  onSave() {
    this.loading = true;
    this.getAction()
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe((response: IProgrammeIndicator) => {
        this.messageHandler.handleMessageInfo('Indicator was succesfully saved');
        this.currentIndicatorService.setValue(response);
        this.currentIndicatorService.refreshStatus();
      });
  }

  private getAction(): Observable<IProgrammeIndicator> {
    return isNaN(this.currentIndicatorService.getId()) ?
      this.currentIndicatorService.create(this.form.value) :
      this.currentIndicatorService.update(this.currentIndicatorService.getId(), this.form.value);
  }

  private initForm(model: IProgrammeIndicator) {
    model = model || { indicatorId: this.currentIndicatorService.getId() } as any;
    const programmeId = this.myProgrammeIndicatorsService.getCurrentProgrammeId();

    this.form = this.formBuilder.group({
      name: [model.name, Validators.required],
      unit: [model.unit, Validators.required],
      description: [model.description, Validators.required],
      target: [model.target, [Validators.required, Validators.min(0)]],
      isCumulative: [model.isCumulative, Validators.required],
      programmeId: [model.programmeId ? model.programmeId : programmeId, Validators.required],
    });
  }
}
