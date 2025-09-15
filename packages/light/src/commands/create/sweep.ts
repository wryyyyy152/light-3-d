import type { IWire } from "light-core";
import { GeometryNode, Property, ShapeType, command } from "light-core";
import { SweepedNode } from "../../bodys";
import type { IStep } from "../../step";
import { SelectShapeStep } from "../../step/selectStep";
import { CreateCommand } from "../createCommand";

@command({
    key: "convert.sweep",
    icon: "icon-sweep",
})
export class Sweep extends CreateCommand {
    @Property.define("option.command.isRoundCorner")
    get round() {
        return this.getPrivateValue("round", false);
    }

    set round(value: boolean) {
        this.setProperty("round", value);
    }

    protected override geometryNode(): GeometryNode {
        const path = this.transformdFirstShape(this.stepDatas[0], false) as IWire;
        const shapes = this.transformdShapes(this.stepDatas[1], false) as IWire[];
        return new SweepedNode(this.document, shapes, path, this.round);
    }

    protected override getSteps(): IStep[] {
        return [
            new SelectShapeStep(ShapeType.Edge | ShapeType.Wire, "prompt.select.path"),
            new SelectShapeStep(ShapeType.Edge | ShapeType.Wire, "prompt.select.section", {
                keepSelection: true,
                multiple: true,
            }),
        ];
    }
}
