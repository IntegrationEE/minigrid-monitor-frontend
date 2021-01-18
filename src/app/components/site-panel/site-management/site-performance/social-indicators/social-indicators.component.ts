import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Utils } from '@core/providers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomDatePickerHeaderComponent } from '@shared/components';
import { AppConst } from 'app/app.const';
import { filter, finalize } from 'rxjs/operators';

import { CurrentSiteService } from '../../site-management.service';
import { SitePerfomanceConst } from '../site-perfomance.const';

import { SocialIndicatorsConst } from './social-indicators.const';
import { SocialIndicatorAction, SocialIndicatorType } from './social-indicators.enum';
import { ISiteVisitObject, ISiteVisits, ISocialIndicatorOption } from './social-indicators.interface';
import { SocialIndicatorsService } from './social-indicators.service';

@UntilDestroy()
@Component({
  selector: 'app-social-indicators',
  templateUrl: './social-indicators.component.html',
  styleUrls: ['./social-indicators.component.scss'],
})
export class SocialIndicatorsComponent implements OnInit, OnDestroy {
  type: SocialIndicatorType;
  topicControl: FormControl;
  visitDate = new FormControl(new Date());
  siteVisitObject: ISiteVisitObject;
  saveActionVisitList: boolean = false;
  saveActionTopic: boolean = false;
  showAll: Boolean = false;
  maxItemsOnLoad: number = 5;
  siteVisitList: ISiteVisits[] = [];
  editIndex: number = -1;
  loading: boolean = true;

  readonly tooltips = SitePerfomanceConst.SITE_PERFOMANCE_GENERAL;
  readonly topics = SocialIndicatorsConst.TOPICS;
  readonly enumTopics: typeof SocialIndicatorType = SocialIndicatorType;
  readonly icons = AppConst.ICONS;

  customHeader: typeof CustomDatePickerHeaderComponent = CustomDatePickerHeaderComponent;

  constructor(private service: SocialIndicatorsService<ISiteVisits>,
              private utils: Utils,
              private currentSiteService: CurrentSiteService) {
  }

  ngOnInit() {
    this.topicControl = new FormControl(null);

    this.service.checkSaveAction()
      .pipe(untilDestroyed(this), filter((action: SocialIndicatorAction) => action !== null))
      .subscribe((action: SocialIndicatorAction) => {
        if (action === SocialIndicatorAction.NONE) {
          this.visitDate.disable();
          this.topicControl.disable();
        } else if (action === SocialIndicatorAction.TOPIC) {
          this.editIndex = -1;
          this.refreshControl();
        } else {
          this.refreshControl();
        }
      });

    this.visitDate.valueChanges
      .pipe(untilDestroyed(this), filter((value: Date) => value !== null))
      .subscribe((value: Date) => {
        this.siteVisitObject = {
          url: this.siteVisitObject.url,
          visitDate: this.utils.getUtcDate(value),
          type: this.type,
        };
      });

    this.topicControl.valueChanges
      .pipe(untilDestroyed(this), filter((option: ISocialIndicatorOption) => option !== null && option.type !== this.type))
      .subscribe((option: ISocialIndicatorOption) => {
        this.type = option.type;
        this.fetchData();
        this.prepareSiteVisitObject();
      });

    this.topicControl.setValue(SocialIndicatorsConst.TOPICS[0]);
  }

  ngOnDestroy() {
    this.service.setSaveAction(null);
  }

  editSiteVisit(visitDate: Date) {
    this.visitDate.setValue(visitDate);
    this.prepareSiteVisitObject();
  }

  showAllVisits() {
    this.showAll = !this.showAll;
  }

  editVisit(item: ISiteVisits, index: number) {
    if (this.editIndex >= 0 && this.editIndex === index) {
      this.service.setSaveAction(SocialIndicatorAction.VISIT);
      this.editIndex = -1;
    } else {
      this.editIndex = index;
      this.editSiteVisit(item.visitDate);
      this.service.setSaveAction(SocialIndicatorAction.NONE);
    }
  }

  editVisitClass(index: number) {
    return this.editIndex >= 0 ?
      (index === this.editIndex ? 'greenRow' : 'grayRow') :
      '';
  }

  private fetchData() {
    this.loading = true;
    this.service.getVisits(this.topicControl.value.url)
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe((response: ISiteVisits[]) => {
        this.siteVisitList = response;
        this.prepareSiteVisitObject();
      });
  }

  private refreshControl() {
    this.visitDate.enable();
    this.topicControl.enable();
    this.currentSiteService.refreshStatus();
  }

  private prepareSiteVisitObject() {
    this.siteVisitObject = {
      visitDate: this.utils.getUtcDate(this.visitDate.value),
      url: this.topicControl.value.url,
      type: this.type,
    };
  }
}
