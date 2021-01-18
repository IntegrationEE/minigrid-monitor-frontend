import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MessageHandler } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmActionDialogComponent } from '@shared/components';
import { AppConst } from 'app/app.const';

import { IProgrammeIndicatorCard } from '../my-programme-indicators.interface';
import { MyProgrammeIndicatorsService } from '../my-programme-indicators.services';

@UntilDestroy()
@Component({
  selector: 'app-programme-indicator-card',
  templateUrl: './programme-indicator-card.component.html',
  styleUrls: ['./programme-indicator-card.component.scss'],
})
export class ProgrammeIndicatorCardComponent {
  @Input() model: IProgrammeIndicatorCard;
  readonly icons = AppConst.ICONS;

  constructor(private myProgrammeIndicatorsService: MyProgrammeIndicatorsService,
              private dialog: MatDialog,
              private messageHandler: MessageHandler) {
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  enableDisable(event: MatSlideToggleChange, modelId: number) {
    this.myProgrammeIndicatorsService.enableDisable(modelId)
      .pipe(untilDestroyed(this))
      .subscribe(() => { }, () => event.source.checked = false);
  }

  openDialog(model: IProgrammeIndicatorCard, event: Event) {
    event.stopPropagation();
    this.dialog
      .open(ConfirmActionDialogComponent, {
        width: AppConst.MODAL_SIZES.MEDIUM,
        data: {
          title: 'Delete Programme Indicator',
          cancel: 'Cancel',
          action: 'Confirm',
          message: 'Are you sure to remove this programme indicator: ' + model.name + '?',
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: boolean) => {
        if (result) {
          this.myProgrammeIndicatorsService.delete(model.id)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.messageHandler.handleMessageInfo('The programme indicator has been removed.');
              this.myProgrammeIndicatorsService.refreshIndicatorList();
            });
        }
      });
  }
}
