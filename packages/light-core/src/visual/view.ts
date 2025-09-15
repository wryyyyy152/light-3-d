import type { IDocument } from "../document";
import type { IPropertyChanged } from "../foundation";
import { IDisposable } from "../foundation";
import type { XYLike, XYZLike } from "../math";
import { Plane, Ray, XY, XYZ, } from "../math";
import type { INodeFilter, IShapeFilter } from "../selectionFilter";
import { ShapeType } from "../shape";
import type { ICameraController } from "./cameraController";
import type { VisualShapeData } from "./detectedData";
import { IVisualObject } from "./visualObject";

export enum ViewMode {
    solid,
    wireframe,
    solidAndWireframe,
}

export type HtmlTextOptions = {
    hideDelete?: boolean;
    center?: XYLike;
    onDispose?: () => void;
};

export interface IView extends IPropertyChanged, IDisposable {
    readonly document: IDocument;
    readonly cameraController: ICameraController;
    get isClosed(): boolean;
    get width(): number;
    get height(): number;
    get dom(): HTMLElement | undefined;
    mode: ViewMode;
    name: string;
    workplane: Plane;
    update(): void;
    up(): XYZ;
    toImage(): string;
    direction(): XYZ;
    rayAt(mx: number, my: number): Ray;
    screenToWorld(mx: number, my: number): XYZ;
    worldToScreen(point: XYZ): XY;
    resize(width: number, heigth: number): void;
    setDom(element: HTMLElement): void;
    htmlText(text: string, point: XYZLike, options?: HtmlTextOptions): IDisposable;
    close(): void;
    detectVisual(x: number, y: number, nodeFilter?: INodeFilter): IVisualObject[];
    detectVisualRect(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        nodeFilter?: INodeFilter,
    ): IVisualObject[];
    detectShapes(shapeType: ShapeType, x: number, y: number, shapeFilter?: IShapeFilter): VisualShapeData[];
    detectShapesRect(
        shapeType: ShapeType,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        shapeFilter?: IShapeFilter,
    ): VisualShapeData[];
}

export namespace IView {
    export function screenDistance(view: IView, mx: number, my: number, point: XYZ) {
        let xy = view.worldToScreen(point);
        let dx = xy.x - mx;
        let dy = xy.y - my;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
