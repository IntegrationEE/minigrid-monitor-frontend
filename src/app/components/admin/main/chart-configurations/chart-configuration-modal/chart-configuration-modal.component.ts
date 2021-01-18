import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageHandler } from '@core/providers';
import { EnumService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, ChartCode, ConvertableType, HTTP } from '@shared/enums';
import { IChartConfiguration, IEnum, IModal } from '@shared/interfaces';
import { finalize } from 'rxjs/operators';

import { ChartConfigurationsService } from '../chart-configurations.service';

@UntilDestroy()
@Component({
  selector: 'app-chart-configuration-modal',
  templateUrl: './chart-configuration-modal.component.html',
})
export class ChartConfigurationModalComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  convertableTypes: IEnum<ConvertableType>[] = [];
  codesNotForConvertable: ChartCode[] = [ChartCode.CUSTOMER_SATISFACTION, ChartCode.CAPEX, ChartCode.OPEX, ChartCode.FINANCING_STRUCTURE];
  readonly actionType: typeof Action = Action;
  private changedData: boolean = false;

  constructor(public dialogRef: MatDialogRef<ChartConfigurationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IModal<IChartConfiguration>,
              private service: ChartConfigurationsService,
              private messageHandler: MessageHandler,
              private formBuilder: FormBuilder,
              private convertableTypeService: EnumService) {
  }

  ngOnInit() {
    this.initForm();
    this.fetchData();
  }

  onConfirm() {
    if (this.form.valid) {
      this.loading = true;

      if (!this.changedData) {
        this.closeDialog(this.data.model, HTTP.PATCH, false);

        return;
      }
      this.data.model.title = this.form.value.title;
      this.data.model.tooltip = this.form.value.tooltip;
      this.data.model.unitOfMeasure = this.form.value.unitOfMeasure;
      this.data.model.isCumulative = this.form.value.isCumulative;
      this.data.model.convertable = this.form.value.convertable || null;

      this.service.update(this.data.model.id, this.data.model)
        .pipe(untilDestroyed(this), finalize(() => this.loading = false))
        .subscribe((response: IChartConfiguration) => this.closeDialog(response, HTTP.PATCH));
    }
  }

  checkIfConvertable(code: ChartCode): boolean {
    return !this.codesNotForConvertable.includes(code);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      typeName: [{ value: this.data.model.typeName, disabled: true }, Validators.required],
      name: [{ value: this.data.model.name, disabled: true }, Validators.required],
      title: [this.data.model.title, Validators.required],
      tooltip: [this.data.model.tooltip],
      unitOfMeasure: [this.data.model.unitOfMeasure],
      isCumulative: [this.data.model.isCumulative, Validators.required],
      convertable: [{ value: this.data.model.convertable, disabled: !this.data.model.unitOfMeasure }],
      code: [this.data.model.code],
    });

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.changedData = true);

    this.form.get('unitOfMeasure').valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((unitOfMeasure: string) => {
        if (unitOfMeasure) {
          this.form.controls['convertable'].enable();
        } else {
          this.form.controls['convertable'].disable();
          this.form.get('convertable').setValue(null);
        }
      });
  }

  private fetchData() {
    this.convertableTypes = this.convertableTypeService.getConvertableTypesValue();
  }

  private closeDialog(data: IChartConfiguration, action: HTTP, showMessage: boolean = true) {
    if (showMessage) {
      this.messageHandler.handleInfo(action, 'Chart configuration');
    }
    this.dialogRef.close(data);
  }
}
