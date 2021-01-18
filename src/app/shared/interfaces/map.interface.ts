import { Layer, LayerGroup } from 'leaflet';

export interface IMapLayer {
  id: string;
  name: string;
  enabled: boolean;
  layer: Layer | LayerGroup;
}
