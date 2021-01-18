import { IGraphNode } from '../graph.interface';

export interface ICanvasNode extends IGraphNode {
    icon: any;
    position?: ICanvasPosition;
    labelPosition?: CanvasPositionType;
}

export interface ICanvasOptions {
    canvasHeight?: number;
    cursor?: ICanvasPosition;
    grid?: {
        columns: number;
        rows: number;
    };
    fonts?: {
        title: IFontOptions;
        value: IFontOptions;
    };
    colors?: {
        lines: string;
        icons: string;
    };
    modifiers?: {
        iconRadius: number;
        text: {
            margin: number;
            vertical: number;
            horizontal: number;
        },
        line: {
            vertical: number;
            horizontal: number;
        },
    };
}

export interface ICanvasPosition {
    x: number;
    y: number;
}

interface IFontOptions {
    size: number; // px
    family: string;
    color: string;
}

export type CanvasPositionType = 'top' | 'right' | 'bottom' | 'left';
export type CanvasDirectionType = 'up' | 'down' | 'right' | 'left';
