import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BreadcrumbsService, ProgrammeService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ILight } from '@shared/interfaces';
import { orderBy } from 'lodash';

import { IProgrammeIndicatorCard } from './my-programme-indicators.interface';
import { MyProgrammeIndicatorsService } from './my-programme-indicators.services';

@UntilDestroy()
@Component({
  selector: 'app-my-programme-indicators',
  templateUrl: './my-programme-indicators.component.html',
  styleUrls: ['./my-programme-indicators.component.scss'],
})
export class MyProgrammeIndicatorsComponent implements OnInit {
  data: IProgrammeIndicatorCard[] = [];
  current: IProgrammeIndicatorCard;
  showAll: Boolean = false;
  maxItemsOnLoad: number = 7;
  programmes: ILight[] = [];
  programmeId: number;
  selectedIndex: number;

  constructor(private myProgrammeIndicatorsService: MyProgrammeIndicatorsService,
              private breadcrumbsService: BreadcrumbsService,
              private programmeService: ProgrammeService) {
  }

  ngOnInit() {
    this.current = null;

    if (this.programmeService.getListValue()) {
      this.programmes = this.programmeService.getListValue();
    } else {
      this.programmeService.getByCurrent()
        .pipe(untilDestroyed(this))
        .subscribe((response: ILight[]) => {
          this.programmes = response;
        });
    }

    this.myProgrammeIndicatorsService.getRefreshList()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.fetchData();
      });

    this.breadcrumbsService.getRefreshPage()
      .pipe(untilDestroyed(this))
      .subscribe((refresh: boolean) => {
        if (refresh) {
          this.current = null;
          this.fetchData();
        }
      });
  }

  setProgrammeId(event: MatTabChangeEvent) {
    const programmeId = this.programmes.filter((option: ILight) => option.name === event.tab.textLabel)[0].id;

    this.myProgrammeIndicatorsService.setCurrentProgrammeId(programmeId);
    this.myProgrammeIndicatorsService.refreshIndicatorList();
  }

  showAllIndicators() {
    this.showAll = !this.showAll;
  }

  goToIndicatorMetadata(indicator: IProgrammeIndicatorCard) {
    this.current = indicator;
    this.breadcrumbsService.setLabel(indicator.name);
  }

  createNewIndicator() {
    this.current = {} as IProgrammeIndicatorCard;
    this.breadcrumbsService.setLabel('New indicator');
  }

  private fetchData() {
    const programmeId = this.myProgrammeIndicatorsService.getCurrentProgrammeId();

    if (programmeId) {
      this.myProgrammeIndicatorsService.getAll(programmeId)
        .pipe(untilDestroyed(this))
        .subscribe((data: IProgrammeIndicatorCard[]) => {
          this.data = orderBy(data, ['isEnabled'], ['desc']);
        });
    }
  }
}
