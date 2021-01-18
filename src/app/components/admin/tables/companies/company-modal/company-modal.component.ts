import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageHandler, Utils } from '@core/providers';
import { CustomCookieService, LocalGovernmentAreaService, StateService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, HTTP, SettingsCode } from '@shared/enums';
import { ICompany, ILight, IModal } from '@shared/interfaces';
import { debounceTime, finalize } from 'rxjs/operators';

import { CompanyManageService } from '../companies.service';

@UntilDestroy()
@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html',
})
export class CompanyModalComponent implements OnInit {
  form: FormGroup;
  statesFilterControl: FormControl = new FormControl();
  lgas: ILight[] = [];
  states: ILight[] = [];
  filteredStates: ILight[] = [];
  loading: boolean = false;
  lgaLabel: string;
  administrativeUnitLabel: string;
  readonly actionType: typeof Action = Action;
  private changedData: boolean = false;

  constructor(public dialogRef: MatDialogRef<CompanyModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IModal<ICompany>,
              private companyService: CompanyManageService,
              private lgaService: LocalGovernmentAreaService,
              private stateService: StateService,
              private messageHandler: MessageHandler,
              private utils: Utils,
              private customCookieService: CustomCookieService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.lgaLabel = this.customCookieService.get(SettingsCode[SettingsCode.LGA_LABEL]);
    this.administrativeUnitLabel = this.customCookieService.get(SettingsCode[SettingsCode.ADMINISTRATIVE_UNIT_LABEL]);

    if (this.data.action !== Action.DELETE) {
      this.initForm();
      this.fetchData();
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
        this.data.model = { ...this.form.value, id: this.data.model.id };
      }

      switch (this.data.action) {
        case Action.CREATE:
          this.companyService.create(this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: ICompany) => this.closeDialog(response, HTTP.POST));
          break;
        case Action.EDIT:
          this.companyService.update(this.data.model.id, this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: ICompany) => this.closeDialog(response, HTTP.PATCH));
          break;
        case Action.DELETE:
          this.companyService.delete(this.data.model.id)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe(() => this.closeDialog(this.data.model, HTTP.DELETE));
          break;
      }
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      city: [this.data.model.city, Validators.required],
      localGovernmentAreaId: [this.data.model.localGovernmentAreaId, Validators.required],
      name: [this.data.model.name, Validators.required],
      number: [this.data.model.number, Validators.required],
      phoneNumber: [this.data.model.phoneNumber, Validators.required],
      stateId: [this.data.model.stateId, Validators.required],
      street: [this.data.model.street, Validators.required],
      websiteUrl: [this.data.model.websiteUrl],
    });

    this.form.get('stateId').valueChanges
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

    this.form.get('stateId').setValue(this.data.model.stateId);

    this.statesFilterControl.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe((value: string) => {
        value = value ? value.trim().toLowerCase() : '';

        this.filteredStates = [...this.states].filter((option: ILight) => {
          return option.name.toLowerCase().indexOf(value) > -1;
        });
      });

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.changedData = true);
  }

  private closeDialog(data: ICompany, action: HTTP, showMessage: boolean = true) {
    if (showMessage) {
      this.messageHandler.handleInfo(action, 'Company');
    }
    this.dialogRef.close(data);
  }

  private fetchData() {
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
}
