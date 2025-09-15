import type { IDocument, IVisual, IVisualFactory } from "light-core";
import { ThreeVisual } from "./threeVisual";

export class ThreeVisulFactory implements IVisualFactory {
    readonly kernelName = "three";
    create(document: IDocument): IVisual {
        return new ThreeVisual(document);
    }
}
