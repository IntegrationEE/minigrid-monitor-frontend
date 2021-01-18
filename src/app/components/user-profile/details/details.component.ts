import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageHandler } from '@core/providers';
import { CustomCookieService, LocalGovernmentAreaService, StateService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsCode } from '@shared/enums';
import { ILight } from '@shared/interfaces';
import { AppConst } from 'app/app.const';
import { debounceTime } from 'rxjs/operators';

import { IUserDetailsModel, IUserDetailsUpdateModel } from '../user-profile.interface';
import { UserProfileServices } from '../user-profile.services';

@UntilDestroy()
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['../user-profile.component.scss'],
})
export class DetailsComponent implements OnInit {
  form: FormGroup;
  statesFilterControl: FormControl = new FormControl();
  filteredStates: ILight[] = [];
  lgas: ILight[] = [];
  states: ILight[] = [];
  administrativeUnitLabel: string;
  lgaLabel: string;
  lgaTooltipAndPlaceholder: string;

  constructor(private userProfileServices: UserProfileServices,
              private formBuilder: FormBuilder,
              private messageHandler: MessageHandler,
              private stateService: StateService,
              private customCookieService: CustomCookieService,
              private lgaService: LocalGovernmentAreaService) {
  }

  ngOnInit() {
    this.fetchData();
    this.administrativeUnitLabel = this.customCookieService.get(SettingsCode[SettingsCode.ADMINISTRATIVE_UNIT_LABEL]);
    this.lgaLabel = this.customCookieService.get(SettingsCode[SettingsCode.LGA_LABEL]);
    this.lgaTooltipAndPlaceholder = 'Select a ' + this.lgaLabel;
  }

  updateDetails() {
    const userDetailsUpdateModel: IUserDetailsUpdateModel = {
      fullName: this.form.value.fullName,
      street: this.form.value.street,
      number: this.form.value.number,
      city: this.form.value.city,
      phoneNumber: this.form.value.phoneNumberPrefix + this.form.value.phoneNumber,
      localGovernmentAreaId: this.form.value.localGovernmentAreaId,
      stateId: this.form.value.stateId,
    };

    this.userProfileServices.updateCurrentUser(userDetailsUpdateModel)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.messageHandler.handleMessageInfo('Data successfully updated');
      });
  }

  private fetchData() {
    this.userProfileServices.getCurrentUser()
      .pipe(untilDestroyed(this))
      .subscribe((response: IUserDetailsModel) => {
        this.initForm(response);
      });

    if (this.stateService.getListValue()) {
      this.states = this.stateService.getListValue();
      this.filteredStates = this.stateService.getListValue();
    } else {
      this.stateService.getList()
        .pipe(untilDestroyed(this))
        .subscribe((response: ILight[]) => {
          this.states = response;
          this.filteredStates = response;
        });
    }
  }

  private getAllLgaByState(stateId: number) {
    this.lgaService.getAllByStateId(stateId)
      .pipe(untilDestroyed(this))
      .subscribe((response: ILight[]) => {
        this.lgas = response;
      });
  }

  private initForm(model: IUserDetailsModel) {
    this.form = this.formBuilder.group({
      fullName: [model.fullName, Validators.required],
      email: [{ value: model.email, disabled: true }],
      city: [model.city, Validators.required],
      street: [model.street, Validators.required],
      number: [model.number, Validators.required],
      phoneNumberPrefix: [model.phoneNumber.substring(0, 4), [Validators.required, Validators.pattern(AppConst.REG_EXP.PHONE_PREFIX)]],
      phoneNumber: [model.phoneNumber.substring(4).trimStart(), [Validators.required, Validators.pattern(AppConst.REG_EXP.PHONE_NUMBER)]],
      localGovernmentAreaId: [model.localGovernmentAreaId, Validators.required],
      stateId: [model.stateId, Validators.required],
    });

    this.getAllLgaByState(this.form.value.stateId);

    this.form.get('stateId').valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((stateId: number) => {
        if (stateId) {
          this.getAllLgaByState(stateId);
          this.form.patchValue({
            localGovernmentAreaId: null,
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
}
