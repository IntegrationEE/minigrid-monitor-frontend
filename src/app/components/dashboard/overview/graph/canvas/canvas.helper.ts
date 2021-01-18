import { ICanvasOptions } from './canvas.interface';

export class CanvasHelper {
  readonly layout: CanvasLayoutHelper;

  constructor() {
    this.layout = new CanvasLayoutHelper();
  }

  textAlign(position: string) {
    if (position === 'left') {
      return 'right';
    } else if (position === 'right') {
      return 'left';
    }

    return 'center';
  }
}

class CanvasLayoutHelper {
  getLayout(canvasElement: HTMLCanvasElement, options: ICanvasOptions) {
    if (canvasElement.width > 1100) {
      return this.getBigLayout(options);
    } else if (canvasElement.width > 750) {
      return this.getMidLayout(options);
    } else {
      return this.getSmallLayout(options);
    }
  }

  private getBigLayout(options: ICanvasOptions) {
    options.grid = {
      columns: 20,
      rows: 10,
    };
    options.fonts.title.size = 16;
    options.fonts.value.size = 24;

    options.modifiers = {
      iconRadius: 50,
      text: {
        vertical: 1.2,
        horizontal: 1,
        margin: 0.4,
      },
      line: {
        vertical: 1.5,
        horizontal: 1.1,
      },
    };

    return this.bigLayout();
  }

  private getMidLayout(options: ICanvasOptions) {
    options.grid = {
      columns: 20,
      rows: 10,
    };
    options.fonts.title.size = 14;
    options.fonts.value.size = 20;

    options.modifiers = {
      iconRadius: 40,
      text: {
        vertical: 0.9,
        horizontal: 1.2,
        margin: 0.25,
      },
      line: {
        vertical: 0.8,
        horizontal: 1.4,
      },
    };

    return this.midLayout();
  }

  private getSmallLayout(options: ICanvasOptions) {
    options.grid = {
      columns: options.grid.rows,
      rows: options.grid.columns + 1,
    };
    options.fonts.title.size = 12;
    options.fonts.value.size = 16;

    options.modifiers = {
      iconRadius: 32,
      text: {
        vertical: 1.7,
        horizontal: 0.7,
        margin: 0.5,
      },
      line: {
        vertical: 1.1,
        horizontal: 0.8,
      },
    };

    return this.smallLayout();
  }

  private *bigLayout() {
    yield { x: 1, y: 5, position: 'bottom' };

    yield { x: 4, y: 1, position: 'right' };
    yield { x: 4, y: 5, position: 'bottom' };
    yield { x: 4, y: 9, position: 'right' };

    yield { x: 7, y: 5, position: 'bottom' };

    yield { x: 11, y: 2, position: 'right' };
    yield { x: 11, y: 4, position: 'right' };
    yield { x: 11, y: 6, position: 'right' };
    yield { x: 11, y: 8, position: 'right' };

    yield { x: 16, y: 2, position: 'right' };
    yield { x: 16, y: 4, position: 'right' };
    yield { x: 16, y: 6, position: 'right' };
    yield { x: 16, y: 8, position: 'right' };
  }

  private *midLayout() {
    yield { x: 1, y: 5, position: 'bottom' };

    yield { x: 6, y: 1, position: 'right' };
    yield { x: 6, y: 5, position: 'bottom' };
    yield { x: 6, y: 9, position: 'right' };

    yield { x: 9, y: 5, position: 'bottom' };

    yield { x: 13, y: 2, position: 'bottom' };
    yield { x: 13, y: 4, position: 'bottom' };
    yield { x: 13, y: 6, position: 'bottom' };
    yield { x: 13, y: 8, position: 'bottom' };

    yield { x: 17, y: 2, position: 'bottom' };
    yield { x: 17, y: 4, position: 'bottom' };
    yield { x: 17, y: 6, position: 'bottom' };
    yield { x: 17, y: 8, position: 'bottom' };
  }

  private *smallLayout() {
    yield { x: 2, y: 8, position: 'bottom' };

    yield { x: 5, y: 3, position: 'right' };
    yield { x: 5, y: 6, position: 'bottom' };
    yield { x: 8, y: 8, position: 'bottom' };

    yield { x: 5, y: 10, position: 'bottom' };

    yield { x: 1, y: 12, position: 'bottom' };
    yield { x: 3, y: 13, position: 'bottom' };
    yield { x: 7, y: 13, position: 'bottom' };
    yield { x: 9, y: 12, position: 'bottom' };

    yield { x: 1, y: 17, position: 'bottom' };
    yield { x: 3, y: 18, position: 'bottom' };
    yield { x: 7, y: 18, position: 'bottom' };
    yield { x: 9, y: 17, position: 'bottom' };
  }
}
