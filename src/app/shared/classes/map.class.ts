import { IMapLayer } from '@shared/interfaces';

export class LeafletLayersModel {
  constructor(
    public baseLayers: IMapLayer[],
    public baseLayer: string,
    public overlayLayers: IMapLayer[] = [],
  ) { }
}
