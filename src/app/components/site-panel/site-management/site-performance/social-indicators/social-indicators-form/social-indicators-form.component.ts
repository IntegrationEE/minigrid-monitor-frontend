import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageHandler } from '@core/providers';
import { ValidationService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HTTP } from '@shared/enums';
import { filter, finalize } from 'rxjs/operators';

import { SocialIndicatorAction, SocialIndicatorType } from '../social-indicators.enum';
import { ISiteVisit, ISiteVisitObject, ISocialIndicatorTopicControl } from '../social-indicators.interface';
import { SocialIndicatorsService } from '../social-indicators.service';

@UntilDestroy()
@Component({
  selector: 'app-social-indicators-form',
  templateUrl: './social-indicators-form.component.html',
  styleUrls: ['../social-indicators.component.scss'],
})
export class SocialIndicatorsFormComponent<T extends ISiteVisit> implements OnInit {
  @Input() set siteObject(siteVisitObject: ISiteVisitObject) {
    this.visitDate = siteVisitObject.visitDate;
    if (!this.type || (this.type !== siteVisitObject.type)) {
      this.url = siteVisitObject.url;
      this.type = siteVisitObject.type;
      this.controls = null;

      if (this.form) {
        this.resetForm();
      }

      this.initForm(this.type);
    }

    if (this.service.checIfExistsVisit(this.visitDate)) {
      this.service.get(this.url, this.visitDate)
        .pipe(untilDestroyed(this))
        .subscribe((response: T) => {
          this.fetchData(response);
        });
    } else {
      this.resetForm();
    }
  }
  form: FormGroup;
  controls: ISocialIndicatorTopicControl[];
  type: SocialIndicatorType;
  loading: boolean;
  editMode: boolean = false;
  private url: string;
  private visitDate: Date | string;

  constructor(private service: SocialIndicatorsService<T>,
              private formBuilder: FormBuilder,
              private messageHandler: MessageHandler,
              private validationService: ValidationService) {
  }

  ngOnInit() {
    this.service.checkSaveAction()
      .pipe(untilDestroyed(this), filter((action: SocialIndicatorAction) => action === SocialIndicatorAction.VISIT))
      .subscribe(() => {
        this.onSave();
      });
  }

  hasError(controlName: string): boolean {
    return this.validationService.hasError(this.form, controlName);
  }

  getError(controlName: string): string {
    return this.validationService.getError(this.form, controlName);
  }

  onSave() {
    this.loading = true;
    this.service.save(this.url, this.form.value)
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe(() => {
        this.messageHandler.handleInfo(HTTP.PATCH, 'Visit');
        this.service.setSaveAction(SocialIndicatorAction.TOPIC);
        this.editMode = true;
      });
  }

  private initForm(type: SocialIndicatorType) {
    this.form = this.formBuilder.group({});
    this.controls = this.service.getConfig(type);

    this.form.addControl('visitDate', new FormControl('visitDate', [Validators.required]));

    this.controls.forEach((item: ISocialIndicatorTopicControl) => {
      this.form.addControl(item.name, new FormControl(item.name, [Validators.required, Validators.pattern(item.regExp)]));
    });
  }

  private resetForm() {
    this.editMode = false;
    if (this.form) {
      this.form.reset();
      this.form.patchValue({
        visitDate: this.visitDate,
      });
    }
  }

  private fetchData(model: T) {
    if (model) {
      this.form.setValue(model);
      this.editMode = true;
    } else {
      this.resetForm();
    }
  }
}
