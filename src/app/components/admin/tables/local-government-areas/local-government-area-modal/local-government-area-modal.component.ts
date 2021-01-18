import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageHandler, Utils } from '@core/providers';
import { CustomCookieService, StateService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, HTTP, SettingsCode } from '@shared/enums';
import { ILight, IModal } from '@shared/interfaces';
import { debounceTime, finalize } from 'rxjs/operators';

import { ILGA } from '../local-government-areas.interface';
import { LocalGovernmentAreaManageService } from '../local-government-areas.service';

@UntilDestroy()
@Component({
  selector: 'app-local-government-area-modal',
  templateUrl: './local-government-area-modal.component.html',
})
export class LocalGovernmentAreaModalComponent implements OnInit {
  form: FormGroup;
  statesFilterControl: FormControl = new FormControl();
  loading: boolean = false;
  states: ILight[] = [];
  filteredStates: ILight[] = [];
  administrativeUnitLabel: string;
  readonly actionType: typeof Action = Action;
  private changedData: boolean = false;

  constructor(public dialogRef: MatDialogRef<LocalGovernmentAreaModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IModal<ILGA>,
              private service: LocalGovernmentAreaManageService,
              private messageHandler: MessageHandler,
              private utils: Utils,
              private formBuilder: FormBuilder,
              private stateService: StateService,
              private customCookieService: CustomCookieService) {
  }

  ngOnInit() {
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
        this.data.model.name = this.form.value.name;
        this.data.model.stateId = this.form.value.stateId;
      }

      switch (this.data.action) {
        case Action.CREATE:
          this.service.create(this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: ILGA) => this.closeDialog(response, HTTP.POST));
          break;
        case Action.EDIT:
          this.service.update(this.data.model.id, this.data.model)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe((response: ILGA) => this.closeDialog(response, HTTP.PATCH));
          break;
        case Action.DELETE:
          this.service.delete(this.data.model.id)
            .pipe(untilDestroyed(this), finalize(() => this.loading = false))
            .subscribe(() => this.closeDialog(this.data.model, HTTP.DELETE));
          break;
      }
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: [this.data.model.name, Validators.required],
      stateId: [this.data.model.stateId, Validators.required],
    });

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

  private closeDialog(data: ILGA, action: HTTP, showMessage: boolean = true) {
    if (showMessage) {
      this.messageHandler.handleInfo(action, 'LGA');
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
