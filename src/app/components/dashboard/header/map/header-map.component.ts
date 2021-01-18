import { Component, Input, NgZone } from '@angular/core';
import { MapOverlayService, MessageHandler } from '@core/providers';
import { AuthenticateService, SettingsService } from '@core/services';
import { OverviewMode } from '@dashboard/dashboard.enum';
import { DashboardService } from '@dashboard/dashboard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFilter, ILatLong } from '@shared/interfaces';
import { latLng, Layer, Map, MapOptions, Marker, marker, PopupEvent } from 'leaflet';

import { HeaderConst } from '../header.const';
import { ISiteList } from '../header.interface';
import { HeaderService } from '../header.service';

@UntilDestroy()
@Component({
  selector: 'app-header-map',
  templateUrl: './header-map.component.html',
  styleUrls: ['./header-map.component.scss'],
})
export class HeaderMapComponent {
  @Input() set setFilters(filters: IFilter) {
    if (filters) {
      this.fetchData(filters);
      const latlong: ILatLong = this.settingService.getCenterPoint();

      if (latlong) {
        this.options.center = latLng(latlong.lat, latlong.long);
      }
    }
  }

  options: MapOptions = {
    zoom: 6,
    zoomControl: true,
    attributionControl: true,
  };
  mapLayers: Layer[];
  markers: Marker[] = [];

  constructor(private overlayService: MapOverlayService,
              private headerService: HeaderService,
              private dashboardService: DashboardService,
              private messageHandler: MessageHandler,
              private authService: AuthenticateService,
              private settingService: SettingsService,
              private zone: NgZone) {
  }

  onMapReady(map: Map) {
    map.invalidateSize();
    map.zoomControl.setPosition('topright');
    map.attributionControl.setPosition('bottomleft');
  }

  private fetchData(filters: IFilter) {
    this.headerService.getSitesByFilters(filters)
      .pipe(untilDestroyed(this))
      .subscribe((data: ISiteList[]) => {
        this.markers = [];
        this.overlayService.resetOverlays(filters.state_names);

        data.forEach((site: ISiteList) => {
          const newMarker = marker(
            [site.lat, site.long],
            {
              icon: this.overlayService.defaultSiteIcon,
            },
          );

          this.setMarkerEvents(newMarker, site);

          this.markers.push(newMarker);
        });

        this.mapLayers = this.overlayService.updatedMapLayers();
      });
  }

  private setMarkerEvents(item: Marker, site: ISiteList) {
    item.bindPopup(this.overlayService.makeSitePopup(site.name), {
      className: 'custom',
    });

    item.on('click', () => {
      if (item.getIcon() !== this.overlayService.selectedSiteIcon) {
        this.mapLayers = this.overlayService.updatedMapLayers();
        this.unselectAllMarkers(this.markers, item);
        item.setIcon(this.overlayService.selectedSiteIcon);
      }

      if (!item.isPopupOpen()) {
        item.openPopup();
      }
    });

    item.addOneTimeEventListener('popupopen', (popupEvent: PopupEvent) => {
      popupEvent.popup.getElement().addEventListener('click', () => {
        if (this.authService.isGuest()) {
          this.zone.run(() => {
            this.messageHandler.handleMessageInfo(HeaderConst.LABELS.DISABLED_SITE);
          });
        } else {
          this.dashboardService.setSite(site.id);
          if (!this.dashboardService.isOverviewModeSite()) {
            this.dashboardService.setOverviewMode(OverviewMode.SITE);
          }
        }
      });
    });
  }

  private unselectAllMarkers(markers: Marker[], currentMarker?: Marker): void {
    markers.forEach((m: Marker) => {
      if (m === currentMarker) {
        m.closePopup();
      } else {
        m.setIcon(this.overlayService.defaultSiteIcon);
      }
    });
  }
}
