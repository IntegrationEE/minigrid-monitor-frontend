import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageHandler } from '@core/providers';
import { CustomCookieService, ValidationService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HTTP, SettingsCode } from '@shared/enums';
import { ISiteFinancialParameter } from '@sites/site-management/site-management.interface';
import { CurrentSiteService } from '@sites/site-management/site-management.service';
import { finalize } from 'rxjs/operators';

import { SiteDetailsConst } from '../site-details.const';

import { FinancialDetailsService } from './financial-details.service';

@UntilDestroy()
@Component({
  selector: 'app-financial-details',
  templateUrl: './financial-details.component.html',
})
export class FinancialDetailsComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  currency: string;
  readonly tooltips = SiteDetailsConst.FINANCIAL_TOOLTIPS;

  constructor(private service: FinancialDetailsService,
              private formBuilder: FormBuilder,
              private messageHandler: MessageHandler,
              private customCookieService: CustomCookieService,
              private currentSiteService: CurrentSiteService,
              private validationService: ValidationService) {
  }

  ngOnInit() {
    this.currency = this.customCookieService.get(SettingsCode[SettingsCode.CURRENCY]);

    this.service.get(this.currentSiteService.getId())
      .pipe(untilDestroyed(this))
      .subscribe((response: ISiteFinancialParameter) => this.initForm(response));
  }

  hasError(controlName: string): boolean {
    return this.validationService.hasError(this.form, controlName);
  }

  getError(controlName: string): string {
    return this.validationService.getError(this.form, controlName);
  }

  onSave() {
    this.loading = true;
    this.service.save(this.currentSiteService.getId(), this.form.value)
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe(() => {
        this.messageHandler.handleInfo(HTTP.PATCH, 'Financial Details');
        this.currentSiteService.refreshStatus();
      });
  }

  private initForm(model: ISiteFinancialParameter) {
    model = model || { siteId: this.currentSiteService.getId() } as ISiteFinancialParameter;

    this.form = this.formBuilder.group({
      siteId: [model.siteId, Validators.required],
      generation: [model.generation, [Validators.required, Validators.min(0)]],
      siteDevelopment: [model.siteDevelopment, [Validators.required, Validators.min(0)]],
      logistics: [model.logistics, [Validators.required, Validators.min(0)]],
      distribution: [model.distribution, [Validators.required, Validators.min(0)]],
      customerInstallation: [model.customerInstallation, [Validators.required, Validators.min(0)]],
      commissioning: [model.commissioning, [Validators.required, Validators.min(0)]],
      taxes: [model.taxes, [Validators.required, Validators.min(0)]],
      financingGrant: [model.financingGrant, [Validators.required, Validators.min(0)]],
      financingEquity: [model.financingEquity, [Validators.required, Validators.min(0)]],
      financingDebt: [model.financingDebt, [Validators.required, Validators.min(0)]],
    });
  }
}
