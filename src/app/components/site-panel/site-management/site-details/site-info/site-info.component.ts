import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapOverlayService, MessageHandler, Utils } from '@core/providers';
import { ProgrammeService, SettingsService, ValidationService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomDatePickerHeaderComponent } from '@shared/components';
import { ILatLong, ILight } from '@shared/interfaces';
import { ISite } from '@sites/site-management';
import { CurrentSiteService } from '@sites/site-management/site-management.service';
import { AppConst } from 'app/app.const';
import { latLng, LatLng, Layer, LeafletMouseEvent, Map, MapOptions, Marker, marker } from 'leaflet';
import { Observable } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

import { SiteDetailsConst } from '../site-details.const';

import { SiteInfoService } from './site-info.service';

@UntilDestroy()
@Component({
  selector: 'app-site-info',
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.scss'],
})
export class SiteInfoComponent implements OnInit {
  form: FormGroup;
  programmes: ILight[];
  options: MapOptions = {
    zoom: 5.5,
    zoomDelta: 0.55,
    zoomControl: true,
    attributionControl: true,
  };
  mapLayers: Layer[];
  loading: boolean = false;
  marker: Marker;
  map: Map;
  showConfirmButton: boolean;
  customHeader: typeof CustomDatePickerHeaderComponent = CustomDatePickerHeaderComponent;
  readonly tooltips = SiteDetailsConst.SITE_INFO;
  readonly icons = AppConst.ICONS;

  constructor(private siteService: SiteInfoService,
              private formBuilder: FormBuilder,
              private programmeService: ProgrammeService,
              private mapService: MapOverlayService,
              private messageHandler: MessageHandler,
              private currentSiteService: CurrentSiteService,
              private settingService: SettingsService,
              private utils: Utils,
              private validationService: ValidationService) {
  }

  ngOnInit() {
    this.fetchData();
    this.mapService.resetOverlays(null, true);
    this.mapLayers = this.mapService.updatedMapLayers();
    const latlong: ILatLong = this.settingService.getCenterPoint();

    if (latlong) {
      this.options.center = latLng(latlong.lat, latlong.long);
    }
  }

  hasError(controlName: string): boolean {
    return this.validationService.hasError(this.form, controlName);
  }

  getError(controlName: string): string {
    return this.validationService.getError(this.form, controlName);
  }

  onMapReady(map: Map) {
    this.map = map;

    if (this.form.value.lat && this.form.value.long) {
      this.setMarker({ lat: this.form.value.lat, lng: this.form.value.long } as LatLng);
    }

    map.invalidateSize();
    map.zoomControl.setPosition('topright');
    map.attributionControl.setPosition('bottomleft');

    map.on('click', (e: LeafletMouseEvent) => {
      this.setMarker(e.latlng);
      this.showConfirmButton = true;
    });
  }

  confirmLocation() {
    const coordinates: LatLng = this.marker.getLatLng();
    const decimalPlaces: number = Math.pow(10, 6);
    const stateId: number = this.getStateByCoordinates(coordinates);

    if (!isNaN(stateId)) {
      this.form.get('lat').setValue(Math.round(coordinates.lat * decimalPlaces) / decimalPlaces);
      this.form.get('long').setValue(Math.round(coordinates.lng * decimalPlaces) / decimalPlaces);
    }
  }

  onSaveSite() {
    const stateId: number = this.getStateByCoordinates({ lat: this.form.value.lat, lng: this.form.value.long } as LatLng);

    if (isNaN(stateId)) {
      return;
    }

    this.form.get('stateId').setValue(stateId);
    this.form.patchValue({
      commissioningDate: this.utils.getUtcDate(this.form.controls.commissioningDate.value),
    });
    this.loading = true;
    this.getAction()
      .pipe(untilDestroyed(this), finalize(() => this.loading = false))
      .subscribe((response: ISite) => {
        this.form.get('companyId').setValue(response.companyId);
        this.messageHandler.handleMessageInfo('Site was succesfully saved');
        this.currentSiteService.setValue(response);
        this.currentSiteService.refreshStatus();
      });
  }

  private getStateByCoordinates(currentPosition: LatLng): number {
    const stateId: number = this.mapService.getState(currentPosition);

    if (!stateId) {
      this.messageHandler.handleMessageError('Coordinates are invalid!');
    }

    return stateId;
  }

  private getAction(): Observable<ISite> {
    return isNaN(this.currentSiteService.getId()) ?
      this.siteService.create(this.form.value) :
      this.siteService.update(this.currentSiteService.getId(), this.form.value);
  }

  private fetchData() {
    this.initForm(this.currentSiteService.getValue());

    this.programmes = this.programmeService.getListValue();
    if (!this.programmes) {
      this.programmeService.getByCurrent()
        .pipe(untilDestroyed(this))
        .subscribe((response: ILight[]) => this.programmes = response);
    }
  }

  private initForm(model: ISite) {
    this.form = this.formBuilder.group({
      name: [model.name, [Validators.required, Validators.pattern(AppConst.REG_EXP.ONLY_LETTERS)]],
      companyId: [model.companyId || 0],
      stateId: [model.stateId],
      programmeId: [model.programmeId, Validators.required],
      lat: [model.lat || undefined, Validators.required],
      long: [model.long || undefined, Validators.required],
      commissioningDate: [model.commissioningDate, Validators.required],
    });

    this.form.get('lat').valueChanges
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe((value: number) => {
        if (!isNaN(value) && !isNaN(this.form.value.long)) {
          this.showConfirmButton = false;
          this.setMarker({ lat: value, lng: this.form.value.long } as LatLng);
        }
      });

    this.form.get('long').valueChanges
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe((value: number) => {
        if (!isNaN(value) && !isNaN(this.form.value.lat)) {
          this.showConfirmButton = false;
          this.setMarker({ lat: this.form.value.lat, lng: value } as LatLng);
        }
      });
  }

  private setMarker(coordinates: LatLng) {
    if (this.marker) {
      this.marker.setLatLng(coordinates);
    } else {
      this.marker = marker(
        [coordinates.lat, coordinates.lng],
        { icon: this.mapService.selectedSiteIcon },
      );
    }

    this.map.setView(this.marker.getLatLng(), this.options.zoom);
  }
}
