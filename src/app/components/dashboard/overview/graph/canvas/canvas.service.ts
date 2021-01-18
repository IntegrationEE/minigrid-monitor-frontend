import { AppConst } from 'app/app.const';

import { GraphNodeIndex } from '../graph.enum';

import { CanvasHelper } from './canvas.helper';
import { CanvasDirectionType, CanvasPositionType, ICanvasNode, ICanvasOptions, ICanvasPosition } from './canvas.interface';

export default class GraphCanvasService {
  private mouseListener: any;
  private resizeListener: any;
  private nodes: ICanvasNode[];

  private options: ICanvasOptions = {
    canvasHeight: 700,
    cursor: {
      x: 0,
      y: 0,
    },
    grid: {
      columns: 20,
      rows: 10,
    },
    fonts: {
      title: {
        size: 16,
        family: 'Source Sans Pro',
        color: 'gray',
      },
      value: {
        size: 24,
        family: 'Source Sans Pro',
        color: 'black',
      },
    },
    colors: {
      lines: AppConst.CHART_COLORS.GREEN,
      icons: 'white',
    },
  };

  private readonly canvasElement: HTMLCanvasElement;
  private readonly canvasHelper: CanvasHelper;

  private get context(): CanvasRenderingContext2D {
    if (!this['_context']) {
      this['_context'] = this.canvasElement.getContext('2d');
    }

    return this['_context'];
  }

  private get nodeSize() {
    return {
      width: Math.floor(this.canvasElement.width / this.options.grid.columns),
      height: Math.floor(this.options.canvasHeight / this.options.grid.rows),
    };
  }

  private get iconRadius() {
    return this.options.modifiers.iconRadius || 45;
  }

  constructor(canvasElement: HTMLCanvasElement, nodes: any[], options?: ICanvasOptions) {
    this.canvasElement = canvasElement;
    this.nodes = nodes;
    this.canvasHelper = new CanvasHelper();

    if (options) {
      this.options = { ...this.options, ...options };
    }

    this.init();
  }

  dispose() {
    this.canvasElement.removeEventListener('mousemove', this.mouseListener);
    window.removeEventListener('resize', this.resizeListener, false);
  }

  draw() {
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.drawNodes();
  }

  update(options: ICanvasOptions) {
    this.options = { ...this.options, ...options };

    this.draw();
  }

  private init() {
    const dpr: number = window.devicePixelRatio || 1;

    this.context.scale(dpr, dpr);

    this.resizeListener = this.resizeCanvas.bind(this);
    window.addEventListener('resize', this.resizeListener, false);
    this.canvasElement.addEventListener('mousemove', this.mouseListener);

    this.resizeCanvas(false);
  }

  private resizeCanvas(redraw: boolean = true) {
    this.canvasElement.height = this.options.canvasHeight;
    this.canvasElement.width = window.innerWidth - 120;

    if (redraw) {
      this.draw();
    }
  }

  private drawNodes() {
    const nodeLayout = this.canvasHelper.layout.getLayout(this.canvasElement, this.options);

    this.nodes.forEach((node: ICanvasNode) => this.drawNode(node, nodeLayout));

    this.nodes.forEach((node: ICanvasNode) => this.drawConnection(node));

    this.nodes.forEach((node: ICanvasNode) => this.drawText(node));
  }

  private drawNode(data: ICanvasNode, nodeGen: Generator<{ x: number, y: number, position: string, revertCompareY?: boolean }>) {
    const next = nodeGen.next();

    if (!next.value) {
      return;
    }

    const { x, y, position } = next.value;

    data.position = { x, y };
    data.labelPosition = position;

    if (this.checkNodeToHide(data)) {
      return;
    }

    this.moveCursorToNode(x, y);

    this.drawIcon(data.icon);
  }

  private drawText(data: ICanvasNode) {

    if ((data.index === GraphNodeIndex.INVERTER) || this.checkNodeToHide(data)) {
      return;
    }

    const { x, y } = data.position;

    this.moveCursorToNode(x, y);

    this.drawValue(data.value, data.unit, data.labelPosition, data.index);
    this.drawTitle(data.title, data.labelPosition);
  }

  private drawValue(value: any, unit: string, position: CanvasPositionType, index: GraphNodeIndex) {
    value = this.checkValueForGridAndTarffis(value, index);

    const baseColor = this.context.fillStyle;
    const { height, width } = this.nodeSize;
    const { size, family, color } = this.options.fonts.value;
    const { iconRadius, text } = this.options.modifiers;

    const h = height > iconRadius ? height : iconRadius;
    const w = width > iconRadius ? width : iconRadius;
    let clearSize = size * 2;

    switch (position) {
      case 'top':
        this.moveCursor(0, -h * text.vertical);
        break;
      case 'left':
        clearSize = 0;
        this.moveCursor(-w * text.horizontal);
        break;
      case 'right':
        this.moveCursor(w * text.horizontal);
        break;
      default:
        this.moveCursor(0, h * text.vertical);
    }

    this.clearTextBackground(this.options.cursor, this.nodeSize.width, clearSize, position);

    const { x, y } = this.options.cursor;

    this.context.font = `bold ${size}px ${family}`;
    this.context.fillStyle = color;
    this.context.textAlign = this.canvasHelper.textAlign(position);
    this.context.fillText(value, x, y, this.nodeSize.width * 2);

    if (unit) {
      const valueWidth: number = this.context.measureText(value).width;
      const factor: number = valueWidth < 10 ? 2.5 : 1;
      const moveBy: number = Math.floor(valueWidth * factor) + 10; // 1 char value has width < 10

      this.context.font = `bold ${Math.floor(size / 2)}px ${family}`;
      this.context.fillText(unit, x + moveBy, y, this.nodeSize.width * 2);
    }

    this.context.fillStyle = baseColor;
  }

  private drawTitle(value: any, position: CanvasPositionType) {
    const baseColor = this.context.fillStyle;
    const { size, family, color } = this.options.fonts.title;
    const { margin } = this.options.modifiers.text;

    this.context.font = `bold ${size}px ${family}`;
    this.context.fillStyle = color;

    this.moveCursor(0, this.nodeSize.height * margin);
    this.clearTextBackground(this.options.cursor, this.nodeSize.width, size * 2, position);

    this.context.textAlign = this.canvasHelper.textAlign(position);
    const { x, y } = this.options.cursor;

    this.context.fillText(value, x, y, this.nodeSize.width * 2);
    this.context.fillStyle = baseColor;
  }

  private clearTextBackground(from: ICanvasPosition, w: number, h: number, position: CanvasPositionType) {
    let { x, y } = from;

    y -= (h / 1.5);
    switch (position) {
      case 'left':
        break;
      case 'right':
        break;
      case 'top':
      case 'bottom':
        x -= (w / 2);
    }

    const baseColor = this.context.fillStyle;

    this.context.fillStyle = 'red';
    this.context.clearRect(x, y, w, h);

    this.context.fillStyle = baseColor;
  }

  private drawIcon(icon: string) {
    this.context.beginPath();
    this.context.arc(this.options.cursor.x, this.options.cursor.y, this.iconRadius, 0, Math.PI * 2, true);

    this.context.fillStyle = this.options.colors.icons;
    this.context.fill();

    this.drawSvgImage(icon);
  }

  private drawSvgImage(src: string) {
    const img = document.createElement('img');
    const position = {
      x: this.options.cursor.x,
      y: this.options.cursor.y,
    };

    img.src = src;
    img.crossOrigin = 'anonymous';

    img.addEventListener('load', () => {
      this.context.drawImage(img,
        position.x - (img.width / 2),
        position.y - (img.height / 2),
        img.width,
        img.height,
      );
    });
  }

  private drawConnection(node: ICanvasNode) {
    const { position, connections } = node;

    if (!position) { return; }

    if (this.checkNodeToHide(node)) {
      return;
    }

    connections.forEach((idx: number) => {
      const nodePosition = this.nodes.find((n: ICanvasNode) => n.index === idx).position;

      if (nodePosition) {
        this.calcConnectionPositions(position, nodePosition);
      }
    });
  }

  private checkValueForGridAndTarffis(value: number, index: GraphNodeIndex): string {
    if (!value && (
      index === GraphNodeIndex.GRID ||
      index === GraphNodeIndex.COMMERCIAL_TARIFF ||
      index === GraphNodeIndex.PRODUCTIVE_TARIFF ||
      index === GraphNodeIndex.PUBLIC_TARIFF ||
      index === GraphNodeIndex.RESIDENTIAL_TARIFF
    )) {
      return AppConst.GENERAL.NOT_APPLICABLE;
    } else {
      return `${value}`;
    }
  }

  private checkNodeToHide(node: ICanvasNode): boolean {
    return (!node.value && (
      node.index === GraphNodeIndex.STORAGE_CAPACITY ||
      node.index === GraphNodeIndex.CONVENTIONAL_CAPACITY
    ));
  }

  private calcConnectionPositions(from: ICanvasPosition, to: ICanvasPosition) {
    const { start, end } = this.calculatePositions(from, to);

    this.drawLine(start, end);
  }

  private calculatePositions(from: ICanvasPosition, to: ICanvasPosition) {
    return this.modifyByGridSize(from, to);
  }

  private modifyByGridSize(from: ICanvasPosition, to: ICanvasPosition) {
    from = {
      x: from.x * this.nodeSize.width,
      y: from.y * this.nodeSize.height,
    };

    to = {
      x: to.x * this.nodeSize.width,
      y: to.y * this.nodeSize.height,
    };

    return this.modifyByDirection(from, to);
  }

  private modifyByDirection(from: ICanvasPosition, to: ICanvasPosition) {
    const direction = this.getDirection(from, to);
    const { vertical, horizontal } = this.options.modifiers.line;

    switch (direction) {
      case 'up':
        from.y -= this.nodeSize.height * vertical;
        to.y += this.nodeSize.height * vertical;
        break;
      case 'down':
        from.y += this.nodeSize.height * vertical;
        to.y -= this.nodeSize.height * vertical;
        break;
      case 'left':
        from.x -= this.nodeSize.width * horizontal;
        to.x += this.nodeSize.width * horizontal;
        break;
      case 'right':
        from.x += this.nodeSize.width * horizontal;
        to.x -= this.nodeSize.width * horizontal;
        break;
    }

    return {
      start: from,
      end: to,
    };
  }

  private getDirection(from: ICanvasPosition, to: ICanvasPosition): CanvasDirectionType {
    if (from.x !== to.x) {
      return from.x < to.x ? 'right' : 'left';
    } else {
      return from.y < to.y ? 'down' : 'up';
    }
  }

  private drawLine(from: ICanvasPosition, to: ICanvasPosition) {
    const defaultColor = this.context.strokeStyle;

    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.lineWidth = 3;
    this.context.strokeStyle = this.options.colors.lines;
    this.context.stroke();

    this.context.strokeStyle = defaultColor;
  }

  private moveCursor(x: number = 0, y: number = 0) {
    this.options.cursor.x += x;
    this.options.cursor.y += y;
  }

  private moveCursorTo(x: number = 0, y: number = 0) {
    this.options.cursor.x = x;
    this.options.cursor.y = y;
  }

  private moveCursorToNode(row: number, col: number) {
    this.moveCursorTo(row * this.nodeSize.width,
      col * this.nodeSize.height);
  }
}
