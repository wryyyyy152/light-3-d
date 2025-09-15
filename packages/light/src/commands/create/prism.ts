import type { IShape } from "light-core";
import { GeometryNode, Precision, ShapeType, command } from "light-core";
import { GeoUtils } from "light-geo";
import { PrismNode } from "../../bodys";
import type { LengthAtAxisSnapData } from "../../snap";
import type { IStep } from "../../step";
import { LengthAtAxisStep } from "../../step";
import { SelectShapeStep } from "../../step/selectStep";
import { CreateCommand } from "../createCommand";

@command({
    key: "create.extrude",
    icon: "icon-prism",
})
export class Prism extends CreateCommand {
    protected override geometryNode(): GeometryNode {
        const shape = this.transformdFirstShape(this.stepDatas[0], false);
        const { point, normal } = this.getAxis(shape);
        const dist = this.stepDatas[1].point!.sub(point).dot(normal);
        return new PrismNode(this.document, shape, dist);
    }

    protected override getSteps(): IStep[] {
        return [
            new SelectShapeStep(ShapeType.Face | ShapeType.Edge | ShapeType.Wire, "prompt.select.shape"),
            new LengthAtAxisStep("prompt.pickNextPoint", this.getLengthStepData, true),
        ];
    }

    private readonly getLengthStepData = (): LengthAtAxisSnapData => {
        const shape = this.transformdFirstShape(this.stepDatas[0]);
        const { point, normal } = this.getAxis(shape);
        return {
            point,
            direction: normal,
            preview: (p) => {
                if (!p) return [];
                const dist = p.sub(point).dot(normal);
                if (Math.abs(dist) < Precision.Float) return [];
                const vec = normal.multiply(dist);
                return [this.meshCreatedShape("prism", shape, vec)];
            },
        };
    };

    private getAxis(shape: IShape) {
        const point = this.stepDatas[0].shapes[0].point!;
        const normal = GeoUtils.normal(shape as any);
        return { point, normal };
    }
}
