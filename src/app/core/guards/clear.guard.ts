import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import {
  BreadcrumbsService,
  CompanyService,
  MeteringTypeService,
  ProgrammeService,
  ThresholdsService,
} from '@core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClearGuard implements CanDeactivate<unknown> {
  constructor(private companyService: CompanyService,
              private programmeService: ProgrammeService,
              private breadcrumbsService: BreadcrumbsService,
              private thresholdsService: ThresholdsService,
              private meteringTypeService: MeteringTypeService) {
  }

  canDeactivate(): Observable<boolean> | boolean {
    this.companyService.claer();
    this.programmeService.claer();
    this.breadcrumbsService.clear();
    this.meteringTypeService.claer();
    this.thresholdsService.claer();

    return true;
  }
}
