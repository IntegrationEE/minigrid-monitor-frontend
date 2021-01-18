import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SettingsService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConventionalTechnology, GridConnection, RenewableTechnology, StorageTechnology } from '@shared/enums';
import { AppConst } from 'app/app.const';

import { OverviewService } from '../overview.service';

import { ICanvasNode } from './canvas/canvas.interface';
import GraphCanvasService from './canvas/canvas.service';
import { GraphNodeIndex } from './graph.enum';
import { IGraphNode, IGraphResponse } from './graph.interface';

@UntilDestroy()
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvasView: ElementRef;
  @Input() set setSiteId(siteId: number) {
    this.fetchData(siteId);
  }
  model: IGraphResponse; // API data
  canvasService: GraphCanvasService;
  private currencyIcon: string;

  get array() {
    return !!this.model ? this.model.details : [];
  }

  constructor(private service: OverviewService<null>,
              private settingService: SettingsService) {
  }

  ngOnInit() {
    this.currencyIcon = this.settingService.getCurrencyIcon();
  }

  ngOnDestroy() {
    this.dispose();
  }

  private fetchData(siteId: number) {
    this.service.getGraph(siteId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IGraphResponse) => {
        this.model = response;

        this.initCanvas();
      });
  }

  private initCanvas() {
    const nodes = this.parseData();

    this.dispose();

    this.canvasService = new GraphCanvasService(
      this.canvasView.nativeElement,
      nodes,
    );

    this.canvasService.draw();
  }

  private dispose() {
    if (this.canvasService) {
      this.canvasService.dispose();
    }
  }

  private parseData() {
    const nodes: ICanvasNode[] = [];

    this.model.nodes.forEach((node: IGraphNode) => {
      const canvasNode = {
        icon: this.getNodeIcon(node, this.model.renewableTechnology, this.model.conventionalTechnology,
          this.model.storageTechnology, this.model.gridConnection),
        ...node,
      };

      nodes.push(canvasNode);
    });

    return nodes;
  }

  private getNodeIcon(node: IGraphNode,
                      renewableTechnology: RenewableTechnology,
                      conventionalTechnology: ConventionalTechnology,
                      storageTechnology: StorageTechnology,
                      gridConnection: GridConnection): string {
    let icon: string;

    switch (node.index) {
      case GraphNodeIndex.RENEWABLE_CAPACITY:
        icon = this.getRenewableIcon(renewableTechnology);
        break;
      case GraphNodeIndex.CONVENTIONAL_CAPACITY:
        icon = this.getConventionalIcon(conventionalTechnology);
        break;
      case GraphNodeIndex.INVERTER:
        icon = AppConst.ICONS.graphInverter;
        break;
      case GraphNodeIndex.STORAGE_CAPACITY:
        icon = this.getStorageTechnology(storageTechnology);
        break;
      case GraphNodeIndex.GRID:
        icon = this.getGridConnectionIcon(gridConnection);
        break;
      case GraphNodeIndex.COMMERCIAL_CONN:
        icon = AppConst.ICONS.graphCommercial;
        break;
      case GraphNodeIndex.RESIDENTIAL_CONN:
        icon = AppConst.ICONS.graphResidential;
        break;
      case GraphNodeIndex.PRODUCTIVE_CONN:
        icon = AppConst.ICONS.graphProductive;
        break;
      case GraphNodeIndex.PUBLIC_CONN:
        icon = AppConst.ICONS.graphPublic;
        break;

      default:
        icon = this.currencyIcon;
        break;
    }

    return icon;
  }

  private getRenewableIcon(technology: RenewableTechnology): string {
    switch (technology) {
      case RenewableTechnology.PV:
        return AppConst.ICONS.graphPV;
      case RenewableTechnology.HYDRO:
        return AppConst.ICONS.graphHydro;
      case RenewableTechnology.BIOMASS:
        return AppConst.ICONS.graphBiomass;
      case RenewableTechnology.WIND:
        return AppConst.ICONS.graphWind;
    }
  }

  private getConventionalIcon(technology: ConventionalTechnology): string {
    if (!technology) {
      return null;
    }

    switch (technology) {
      case ConventionalTechnology.DIESEL:
        return AppConst.ICONS.graphDiesel;
      case ConventionalTechnology.BIODIESEL:
        return AppConst.ICONS.graphBiodiesel;
    }
  }

  private getStorageTechnology(technology: StorageTechnology): string {
    if (!technology) {
      return null;
    }

    switch (technology) {
      case StorageTechnology.BATTERY:
        return AppConst.ICONS.graphBattery;
    }
  }

  private getGridConnectionIcon(type: GridConnection): string {
    switch (type) {
      case GridConnection.OFF_GRID:
        return AppConst.ICONS.graphOffGrid;
      case GridConnection.ON_GRID:
        return AppConst.ICONS.graphOnGrid;
    }
  }
}
