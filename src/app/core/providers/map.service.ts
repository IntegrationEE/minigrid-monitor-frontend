import { Injectable } from '@angular/core';
import { StateService } from '@core/services';
import { LeafletLayersModel } from '@shared/classes';
import { IMapLayer, IStateMap } from '@shared/interfaces';
import { MapConst } from '@shared/map.const';
import { AppConst } from 'app/app.const';
import { geoJSON, icon, LatLng, Layer, Polyline } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapOverlayService {
  // Layers Model object
  model: LeafletLayersModel;
  defaultSiteIcon = icon({
    iconSize: [5, 5],
    iconAnchor: [3, 5],
    iconUrl: AppConst.ICONS.marker,
  });
  selectedSiteIcon = icon({
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41],
    iconUrl: AppConst.ICONS.markerGreen,
  });

  private unselectedGeoJSONs: IMapLayer[] = [];
  private selectedGeoJSONs: IMapLayer[] = [];
  private states: IStateMap[];

  constructor(private stateService: StateService) {
    this.states = this.stateService.getCoordinatesValue();
    this.unselectedGeoJSONs = this.getColoredStateOverlays(AppConst.CHART_COLORS.GREY_DARK, true);
    this.selectedGeoJSONs = this.getColoredStateOverlays(AppConst.CHART_COLORS.GREEN_LIGHT, false);

    this.model = new LeafletLayersModel(
      [
        MapConst.LAYER_OSM,
        MapConst.LAYER_OCM,
        MapConst.LAYER_HOSM,
        MapConst.LAYER_ESRI,
        MapConst.LAYER_WMFLABS,
      ],
      MapConst.LAYER_WMFLABS.id,
      [],
    );

    this.model.overlayLayers.push(...this.unselectedGeoJSONs);
    this.model.overlayLayers.push(...this.selectedGeoJSONs);
  }

  getBaseLayers(): any {
    return {
      'Open Cycle Map': MapConst.LAYER_OCM.layer,
      'Open Street Map': MapConst.LAYER_OSM.layer,
      'Humanitarian Open Street Map': MapConst.LAYER_HOSM.layer,
      'ESRI Map': MapConst.LAYER_ESRI.layer,
      'WMFLABS Map': MapConst.LAYER_WMFLABS.layer,
    };
  }

  updatedMapLayers(): Layer[] {
    // Get the active base layer
    const baseLayer = this.model.baseLayers.find((l: any) => (l.id === this.model.baseLayer));

    // Get all the active overlay layers
    const layers: Layer[] = this.model.overlayLayers
      .filter((l: any) => l.enabled)
      .map((l: any) => l.layer);

    layers.unshift(baseLayer.layer);

    return layers;
  }

  resetOverlays(states?: string[], showAll: boolean = false) {
    this.unselectedGeoJSONs.forEach((l: any) => {
      l.enabled = showAll || (states && states.findIndex((f: string) => f === l.name) > -1) ? false : true;
    });

    this.selectedGeoJSONs.forEach((l: any) => {
      l.enabled = showAll || (states && states.findIndex((f: string) => f === l.name) > -1) ? true : false;
    });
  }

  makeSitePopup(name: string): string {
    return `` +
      `<div><b>${name}</b></div>` +
      `<div><u>Visit site &#x1f862;</u></div>`;
  }

  getState(currentPosition: LatLng): number {
    const layers: any[] = this.unselectedGeoJSONs;
    let stateId: number;

    for (const layer of layers) {
      const current: Polyline[] = layer.layer.getLayers();
      const coordinates: LatLng[][] = current[0].getLatLngs() as LatLng[][];

      coordinates.forEach((coordinate: LatLng[]) => {
        if (this.validateCoordinates(coordinate, currentPosition)) {
          stateId = this.states.find((state: IStateMap) => state.name === layer.name).id;

          return;
        }
      });
    }

    return stateId;
  }

  private validateCoordinates(coordinates: LatLng[], current: LatLng) {
    let inside = false;
    let i = 0;

    for (let j = coordinates.length - 1; i < coordinates.length; j = i++) {
      const xi = coordinates[i].lat;
      const yi = coordinates[i].lng;

      const xj = coordinates[j].lat;
      const yj = coordinates[j].lng;

      const intersect = ((yi > current.lng) !== (yj > current.lng)) && (current.lat < (xj - xi) * (current.lng - yi) / (yj - yi) + xi);

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  private getColoredStateOverlays(color: string, visible: boolean): IMapLayer[] {
    const style = { color, weight: 1, opacity: 0.5 };
    const overlays: IMapLayer[] = [];

    this.states.forEach((state: IStateMap) => {
      overlays.push({
        id: `${state.id}`,
        name: state.name,
        enabled: visible,
        layer: geoJSON(
          ({ type: 'Polygon', coordinates: state.coordinates }) as any,
          { style }),
      });
    });

    return overlays;
  }
}
