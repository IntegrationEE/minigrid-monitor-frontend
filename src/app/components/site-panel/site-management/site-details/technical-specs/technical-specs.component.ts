import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageHandler } from '@core/providers';
import { EnumService, MeteringTypeService, ThresholdsService, ValidationService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConventionalTechnology, GridConnection, HTTP, RenewableTechnology, StorageTechnology, ThresholdCode } from '@shared/enums';
import { IEnum, ILight, IThreshold } from '@shared/interfaces';
import { ISiteTechnicalParameter } from '@sites/site-management/site-management.interface';
import { CurrentSiteService } from '@sites/site-management/site-management.service';
import { AppConst } from 'app/app.const';
import { finalize } from 'rxjs/operators';

import { SiteDetailsConst } from '../site-details.const';

import { TechnicalSpecsService } from './technical-specs.service';

@UntilDestroy()
@Component({
  selector: 'app-technical-specs',
  templateUrl: './technical-specs.component.html',
})
export class TechnicalSpecsComponent implements OnInit {
  form: FormGroup;
  meterinTypes: ILight[] = [];
  thresholds: IThreshold[] = [];
  loading: boolean;
  conventionalCapacityMin: number = 0;
  conventionalCapacityMax: number = 0;
  renewableCapacityMin: number = 0;
  renewableCapacityMax: number = 0;
  storageCapacityMin: number = 0;
  storageCapacityMax: number = 0;
  gridLengthMin: number = 0;
  gridLengthMax: number = 0;
  gridConnections: IEnum<GridConnection>[];
  renewableTechnologies: IEnum<RenewableTechnology>[];
  conventionalTechnologies: IEnum<ConventionalTechnology>[];
  storageTechnologies: IEnum<StorageTechnology>[];
  readonly gridConnectionTypes: typeof GridConnection = GridConnection;
  readonly tooltips = SiteDetailsConst.TECHNICAL_SPECS;

  constructor(private service: TechnicalSpecsService,
              private formBuilder: FormBuilder,
              private meteringTypeService: MeteringTypeService,
              private messageHandler: MessageHandler,
              private thresholdsService: ThresholdsService,
              private currentSiteService: CurrentSiteService,
              private validationService: ValidationService,
              private enumService: EnumService) {
  }

  ngOnInit() {
    this.service.get(this.currentSiteService.getId())
      .pipe(untilDestroyed(this))
      .subscribe((response: ISiteTechnicalParameter) => this.initForm(response));

    this.fetchData();
  }

  onSave() {
    this.loading = true;
    this.service.save(this.currentSiteService.getId(), this.form.value)
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe(() => {
        this.messageHandler.handleInfo(HTTP.PATCH, 'Technical Parameters');
        this.currentSiteService.refreshStatus();
      });
  }

  hasError(controlName: string): boolean {
    return this.validationService.hasError(this.form, controlName);
  }

  getError(controlName: string): string {
    return this.validationService.getError(this.form, controlName);
  }

  private initForm(model: ISiteTechnicalParameter) {
    model = model || { siteId: this.currentSiteService.getId() } as ISiteTechnicalParameter;

    const conventionalCapacityThresholds = this.getThreshold(ThresholdCode.CONVENTIONAL_CAPACITY);
    const renewableCapacityThresholds = this.getThreshold(ThresholdCode.RENEWABLE_CAPACITY);
    const storageCapacityThresholds = this.getThreshold(ThresholdCode.STORAGE_CAPACITY);
    const gridLengthThresholds = this.getThreshold(ThresholdCode.GRID_LENGTH);

    this.conventionalCapacityMin = conventionalCapacityThresholds.min;
    this.conventionalCapacityMax = conventionalCapacityThresholds.max;
    this.renewableCapacityMin = renewableCapacityThresholds.min;
    this.renewableCapacityMax = renewableCapacityThresholds.max;
    this.storageCapacityMin = storageCapacityThresholds.min;
    this.storageCapacityMax = storageCapacityThresholds.max;
    this.gridLengthMin = gridLengthThresholds.min;
    this.gridLengthMax = gridLengthThresholds.max;

    this.form = this.formBuilder.group({
      siteId: [model.siteId, Validators.required],
      renewableTechnology: [model.renewableTechnology, Validators.required],
      renewableCapacity: [model.renewableCapacity,
        [Validators.required, Validators.min(this.renewableCapacityMin), Validators.max(this.renewableCapacityMax)]],
      conventionalTechnology: [model.conventionalTechnology],
      conventionalCapacity: [model.conventionalCapacity,
        [Validators.required, Validators.min(this.conventionalCapacityMin), Validators.max(this.conventionalCapacityMax)]],
      storageTechnology: [model.storageTechnology],
      storageCapacity: [model.storageCapacity,
        [Validators.required, Validators.min(this.storageCapacityMin), Validators.max(this.storageCapacityMax)]],
      gridConnection: [model.gridConnection, Validators.required],
      gridLength: [model.gridLength, [Validators.min(this.gridLengthMin), Validators.max(this.gridLengthMax)]],
      inverterManufacturer: [model.inverterManufacturer],
      meterManufacturer: [model.meterManufacturer, [Validators.pattern(AppConst.REG_EXP.ONLY_LETTERS)]],
      meteringTypeId: [model.meteringTypeId, Validators.required],

    });

    this.disableEnableControl('conventionalCapacity', model.conventionalTechnology === -1);
    this.disableEnableControl('storageCapacity', model.storageTechnology === -1);

    this.form.get('conventionalTechnology').valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value: number) => {
        this.disableEnableControl('conventionalCapacity', value === -1);
      });

    this.form.get('storageTechnology').valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value: number) => {
        this.disableEnableControl('storageCapacity', value === -1);
      });
  }

  private disableEnableControl(controlName: string, isDisabled: boolean) {
    if (isDisabled) {
      this.form.get(controlName).disable();
      this.form.get(controlName).setValue(0);
    } else {
      this.form.get(controlName).enable();
    }
  }

  private fetchData() {
    this.gridConnections = this.enumService.getGridConnectionsValue();
    if (!this.gridConnections) {
      this.enumService.getGridConnections()
        .pipe(untilDestroyed(this))
        .subscribe((response: IEnum<GridConnection>[]) => this.gridConnections = response);
    }

    this.conventionalTechnologies = this.enumService.getConventionalTechnologiesValue();
    if (!this.conventionalTechnologies) {
      this.enumService.getConventionalTechnologies()
        .pipe(untilDestroyed(this))
        .subscribe((response: IEnum<ConventionalTechnology>[]) => this.conventionalTechnologies = response);
    }

    this.storageTechnologies = this.enumService.getStorageTechnologiesValue();
    if (!this.storageTechnologies) {
      this.enumService.getStorageTechnologies()
        .pipe(untilDestroyed(this))
        .subscribe((response: IEnum<StorageTechnology>[]) => this.storageTechnologies = response);
    }

    this.renewableTechnologies = this.enumService.getRenewableTechnologiesValue();
    if (!this.renewableTechnologies) {
      this.enumService.getRenewableTechnologies()
        .pipe(untilDestroyed(this))
        .subscribe((response: IEnum<RenewableTechnology>[]) => this.renewableTechnologies = response);
    }

    if (this.thresholdsService.getThresholdsValue()) {
      this.thresholds = this.thresholdsService.getThresholdsValue();
    } else {
      this.thresholdsService.getAll()
        .pipe(untilDestroyed(this))
        .subscribe((response: IThreshold[]) => {
          this.thresholds = response;
        });
    }

    this.meterinTypes = this.meteringTypeService.getListValue();
    if (!this.meterinTypes) {
      this.meteringTypeService.getAll()
        .pipe(untilDestroyed(this))
        .subscribe((response: ILight[]) => this.meterinTypes = response);
    }
  }

  private getThreshold(code: ThresholdCode): IThreshold {
    return this.thresholds.find((threshold: IThreshold) => threshold.code === code);
  }
}
