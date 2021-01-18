import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { CompanyService, CustomCookieService, LocalGovernmentAreaService, SignInService, StateService,
  ValidationService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsCode } from '@shared/enums';
import { IAuth, ILight } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { debounceTime } from 'rxjs/operators';

import { WelcomePageStage } from './welcome-page.enum';
import { IFirstSignIn } from './welcome-page.interface';

@UntilDestroy()
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['../../../shared/styles/auth.scss'],
})
export class WelcomePageComponent implements OnInit {
  stage: WelcomePageStage = WelcomePageStage.FULL_NAME;
  fullName: FormControl = new FormControl('', Validators.required);
  companyForm: FormGroup;
  contactForm: FormGroup;
  statesFilterControl: FormControl = new FormControl();
  hideCompanyDetails: boolean = true;
  companies: ILight[] = [];
  lgas: ILight[] = [];
  states: ILight[] = [];
  filteredStates: ILight[] = [];
  title: string = 'Hi there, thank you for signing up!';
  subtitle: string = 'Before we start, we will need a little bit more information about you';
  buttonText: string = 'Continue 🡢';
  loading: boolean = false;
  lgaLabel: string;
  administrativeUnitLabel: string;
  organisationLabel: string;
  readonly icons = AppConst.ICONS;
  readonly stages: typeof WelcomePageStage = WelcomePageStage;

  constructor(private companyService: CompanyService,
              private lgaService: LocalGovernmentAreaService,
              private stateService: StateService,
              private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private signInService: SignInService,
              private customCookieService: CustomCookieService,
              private validationService: ValidationService) {
  }

  ngOnInit() {
    this.lgaLabel = this.customCookieService.get(SettingsCode[SettingsCode.LGA_LABEL]);
    this.administrativeUnitLabel = this.customCookieService.get(SettingsCode[SettingsCode.ADMINISTRATIVE_UNIT_LABEL]);
    this.organisationLabel = this.customCookieService.get(SettingsCode[SettingsCode.ORGANISATION_LABEL]);
  }

  nextStage(event: Event) {
    if (!this.isValid()) {
      event.preventDefault();

      return;
    }

    switch (this.stage) {
      case WelcomePageStage.FULL_NAME:
        this.initCompanyForm();
        this.fetchCompanyData();
        this.stage = WelcomePageStage.COMPANY;
        this.title = 'Where do you work?';
        this.subtitle = null;
        break;
      case WelcomePageStage.COMPANY:
        if (this.companyForm.value.companyId) {
          this.stage = WelcomePageStage.COMPLETE;
          this.saveData();
          break;
        }
        this.initContactForm();
        this.stage = WelcomePageStage.CONTACT;
        this.title = 'Almost there ...';
        this.subtitle = null;
        this.buttonText = 'Complete sign up 🡢';
        break;
      case WelcomePageStage.CONTACT:
        this.saveData();
        break;
      case WelcomePageStage.COMPLETE:
        const refreshToke: string = this.customCookieService.get(AppConst.TOKEN.REFRESH);

        this.customCookieService.deleteAll();

        this.signInService.reAuth(refreshToke)
          .pipe(untilDestroyed(this))
          .subscribe((auth: IAuth) => {
            this.customCookieService.storeAuth(auth);
            this.router.navigate([`/${AppConst.MAIN_ROUTES.DASHBOARD}`]);
          });
        break;
    }
  }

  isValid(): boolean {
    switch (this.stage) {
      case WelcomePageStage.FULL_NAME:
        return this.fullName.valid;
      case WelcomePageStage.COMPANY:
        return this.companyForm.valid;
      case WelcomePageStage.CONTACT:
        return this.companyForm.value.companyId || this.contactForm.valid;
      case WelcomePageStage.COMPLETE:
        return true;
    }
  }

  hasError(controlName: string): boolean {
    switch (this.stage) {
      case WelcomePageStage.COMPANY:
        return this.validationService.hasError(this.companyForm, controlName);
      case WelcomePageStage.CONTACT:
        return this.companyForm.value.companyId || this.validationService.hasError(this.contactForm, controlName);
      default:
        return false;
    }
  }

  getError(controlName: string): string {
    switch (this.stage) {
      case WelcomePageStage.COMPANY:
        return this.validationService.getError(this.companyForm, controlName);
      case WelcomePageStage.CONTACT:
        if (!this.companyForm.value.companyId) {
          return this.validationService.getError(this.contactForm, controlName);
        }

        return null;
      default:
        return null;
    }
  }

  getTooltip(labelName: string): string {
    return 'Please select a ' + labelName + ' from the list';
  }

  getPlaceholder(labelName: string): string {
    return 'Select ' + labelName + ' ...';
  }

  private initCompanyForm() {
    this.companyForm = this.formBuilder.group({
      companyId: new FormControl(null),
      companyName: new FormControl(null, Validators.required),
      street: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      stateId: new FormControl(null, Validators.required),
      localGovernmentAreaId: new FormControl(null, Validators.required),
    });

    this.companyForm.get('companyId').valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((companyId: number) => {
        if (companyId) {
          this.hideCompanyDetails = true;
          this.buttonText = 'Complete sign up 🡢';
          this.companyForm.get('companyId').setValidators(Validators.required);
          this.companyForm.get('companyName').disable();
          this.companyForm.get('street').disable();
          this.companyForm.get('number').disable();
          this.companyForm.get('city').disable();
          this.companyForm.get('stateId').disable();
          this.companyForm.get('localGovernmentAreaId').disable();
        } else {
          this.hideCompanyDetails = false;
          this.buttonText = 'Continue 🡢';
          this.companyForm.get('companyId').clearValidators();
          this.companyForm.get('companyName').enable();
          this.companyForm.get('street').enable();
          this.companyForm.get('number').enable();
          this.companyForm.get('city').enable();
          this.companyForm.get('stateId').enable();
          this.companyForm.get('localGovernmentAreaId').enable();
        }
      });

    this.companyForm.get('stateId').valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((stateId: number) => {
        if (stateId) {
          this.lgaService.getAllByStateId(stateId)
            .pipe(untilDestroyed(this))
            .subscribe((response: ILight[]) => {
              this.lgas = response;
            });
        } else {
          this.lgas = [];
        }
      });

    this.statesFilterControl.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe((value: string) => {
        value = value ? value.trim().toLowerCase() : '';

        this.filteredStates = [...this.states].filter((option: ILight) => {
          return option.name.toLowerCase().includes(value);
        });
      });
  }

  private saveData() {
    this.authService.setUserDetails(this.getModel())
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.stage = WelcomePageStage.COMPLETE;
        this.title = 'Great! Your account has been created';
        this.subtitle = 'Waiting for approval from the administrator.';
        this.buttonText = 'Go to dashboard 🡢';
      });
  }

  private fetchCompanyData() {
    this.companyService.getList()
      .pipe(untilDestroyed(this))
      .subscribe((response: ILight[]) => {
        this.companies = response;
      });

    this.stateService.getList()
      .pipe(untilDestroyed(this))
      .subscribe((response: ILight[]) => {
        this.states = response;
        this.filteredStates = response;
      });
  }

  private initContactForm() {
    this.contactForm = this.formBuilder.group({
      phoneNumberPrefix: new FormControl(null, [Validators.required, Validators.pattern(AppConst.REG_EXP.PHONE_PREFIX)]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(AppConst.REG_EXP.PHONE_NUMBER)]),
      websiteUrl: new FormControl(''),
    });
  }

  private getModel(): IFirstSignIn {
    const model: IFirstSignIn = {
      fullName: this.fullName.value,
      companyId: this.companyForm.value.companyId || null,
    } as IFirstSignIn;

    if (!model.companyId) {
      model.companyName = this.companyForm.value.companyName;
      model.city = this.companyForm.value.city;
      model.street = this.companyForm.value.street;
      model.number = this.companyForm.value.number;
      model.stateId = this.companyForm.value.stateId;
      model.localGovernmentAreaId = this.companyForm.value.localGovernmentAreaId;
      model.phoneNumber = `${this.contactForm.value.phoneNumberPrefix} ${this.contactForm.value.phoneNumber}`;
      model.websiteUrl = this.contactForm.value.websiteUrl;
    }

    return model;
  }
}
