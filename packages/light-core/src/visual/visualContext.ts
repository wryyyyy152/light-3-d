import type { INodeChangedObserver } from "../foundation";
import { IDisposable } from "../foundation";
import { BoundingBox } from "../math";
import { INode } from "../model";
import type { IShapeFilter } from "../selectionFilter";
import { ShapeMeshData } from "../shape";
import { IVisualObject } from "./visualObject";

export interface IVisualContext extends IDisposable, INodeChangedObserver {
    get shapeCount(): number;
    addVisualObject(object: IVisualObject): void;
    boundingBoxIntersectFilter(boundingBox: BoundingBox, filter?: IShapeFilter): IVisualObject[];
    removeVisualObject(object: IVisualObject): void;
    addNode(nodes: INode[]): void;
    removeNode(nodes: INode[]): void;
    getVisual(node: INode): IVisualObject | undefined;
    getNode(visual: IVisualObject): INode | undefined;
    redrawNode(nodes: INode[]): void;
    setVisible(node: INode, visible: boolean): void;
    visuals(): IVisualObject[];
    displayMesh(datas: ShapeMeshData[], opacity?: number): number;
    removeMesh(id: number): void;
}
