import { ConventionalTechnology, GridConnection, RenewableTechnology, StorageTechnology } from '@shared/enums';

import { GraphNodeIndex } from './graph.enum';

export interface IGraphResponse {
  renewableTechnology: RenewableTechnology;
  conventionalTechnology?: ConventionalTechnology;
  storageTechnology?: StorageTechnology;
  gridConnection: GridConnection;
  details: IGraphLabel[];
  nodes: IGraphNode[];
}

export interface IGraphNode {
  index: GraphNodeIndex;
  value: number;
  unit: string;
  title: string;
  connections: number[];
}

export interface IGraphLabel {
  title: string;
  value: string;
}
