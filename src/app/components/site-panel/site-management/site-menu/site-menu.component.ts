import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageHandler } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { CurrentSiteService } from '../site-management.service';

import { SiteMenuMode, SiteMenuPage } from './site-menu.enum';
import { ISiteMenuOption, ISiteStatus } from './site-menu.interface';
import { SiteMenuService } from './site-menu.service';

@UntilDestroy()
@Component({
  selector: 'app-site-menu',
  templateUrl: './site-menu.component.html',
  styleUrls: ['./site-menu.component.scss'],
})
export class SiteMenuComponent implements OnInit {
  @Input() set setMode(mode: SiteMenuMode) {
    this.mode = mode;
    this.current = mode === SiteMenuMode.DETAILS ? SiteMenuPage.INFO : SiteMenuPage.TECHNICAL;
  }
  @Output() onPageChange: EventEmitter<SiteMenuPage> = new EventEmitter(null);
  options: ISiteMenuOption[] = [];
  current: SiteMenuPage;
  mode: SiteMenuMode;
  qrCode: SafeUrl;
  siteId: number;
  loading: boolean = false;
  readonly siteMenuModes: typeof SiteMenuMode = SiteMenuMode;
  readonly siteMenuPages: typeof SiteMenuPage = SiteMenuPage;

  constructor(private siteService: SiteMenuService,
              private sanitizer: DomSanitizer,
              private messageHandler: MessageHandler,
              private currentSiteService: CurrentSiteService) {
  }

  ngOnInit() {
    this.currentSiteService.getRefresh()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.siteId = this.currentSiteService.getId();
        this.qrCode = this.currentSiteService.getQrCodeValue();
        if (!this.qrCode) {
          this.getQrCode(this.siteId);
        }

        if (this.siteId) {
          this.siteService.getStatus(this.siteId)
            .pipe(untilDestroyed(this))
            .subscribe((response: ISiteStatus) => {
              this.setLabels(response);
            });
        } else {
          this.setLabels();
        }
      });
  }

  onSelectPage(page: SiteMenuPage) {
    this.onPageChange.next(page);
    this.current = page;
  }

  getQrCode(siteId: number) {
    this.currentSiteService.getQrCode(siteId)
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe((qrCode: Blob) => {
        this.qrCode = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(qrCode));
      });
  }

  updateQrCode() {
    this.currentSiteService.updateQrCode(this.siteId)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.getQrCode(this.siteId);
        this.messageHandler.handleMessageInfo('The QR code has been updated successfully.');
      });
  }

  private setLabels(status: ISiteStatus = null) {
    switch (this.mode) {
      case SiteMenuMode.DETAILS:
        this.options = [
          { label: 'Site info', status: status ? status.siteInfo : 'red', page: SiteMenuPage.INFO },
        ];

        if (status) {
          this.options.push({ label: 'Technical specs', status: status ? status.technicalSpec : 'red', page: SiteMenuPage.TECHNICAL });
          this.options.push({ label: 'Financial details', status: status ? status.financialDetails : 'red', page: SiteMenuPage.FINANCIAL });
        }
        break;
      case SiteMenuMode.PERFORMANCE:
        this.options = [
          { label: 'Technical indicators', status: status.technicalIndicators, page: SiteMenuPage.TECHNICAL },
          { label: 'Social indicators', status: status.socialIndicators, page: SiteMenuPage.SOCIAL },
          { label: 'Financial indicators', status: status.financialIndicators, page: SiteMenuPage.FINANCIAL },
        ];
        break;
    }
  }
}
