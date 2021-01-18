import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MessageHandler } from '@core/providers';
import { AuthenticateService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmActionDialogComponent } from '@shared/components';
import { ConventionalTechnology, GridConnection } from '@shared/enums';
import { AppConst } from 'app/app.const';

import { ISiteCard } from '../my-sites.interface';
import { MySitesService } from '../my-sites.services';

@UntilDestroy()
@Component({
  selector: 'app-site-card',
  templateUrl: './site-card.component.html',
  styleUrls: ['./site-card.component.scss'],
})
export class SiteCardComponent implements OnInit {
  @Input() model: ISiteCard;
  isDeveloper: boolean;
  readonly icons = AppConst.ICONS;
  readonly gridConnections: typeof GridConnection = GridConnection;
  readonly conventionalTechologies: typeof ConventionalTechnology = ConventionalTechnology;

  constructor(private mySitesService: MySitesService,
              private messageHandler: MessageHandler,
              private authService: AuthenticateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.isDeveloper = this.authService.isDeveloper();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  publishedUnpublished(event: MatSlideToggleChange, modelId: number) {
    this.mySitesService.publishedUnpublished(modelId)
      .pipe(untilDestroyed(this))
      .subscribe(() => { }, () => event.source.checked = false);
  }

  openDialog(model: ISiteCard, event: Event) {
    event.stopPropagation();
    this.dialog
      .open(ConfirmActionDialogComponent, {
        width: AppConst.MODAL_SIZES.SMALL,
        data: {
          title: 'Delete Site',
          cancel: 'Cancel',
          action: 'Confirm',
          message: 'Are you sure to remove this site: ' + model.name + '?',
        },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: boolean) => {
        if (result) {
          this.mySitesService.delete(model.id)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.messageHandler.handleMessageInfo('The site has been removed.');
              this.mySitesService.refreshSiteList();
            });
        }
      });
  }
}
