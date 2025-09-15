import type { I18nKeys, IDocument, IShape } from "light-core";
import {
    ParameterShapeNode,
    Property,
    Result,
    Serializer,
    XYZ,
} from "light-core";

@Serializer.register(["document", "normal", "center", "start", "angle"])
export class ArcNode extends ParameterShapeNode {
    override display(): I18nKeys {
        return "body.arc";
    }

    @Serializer.serialze()
    @Property.define("circle.center")
    get center() {
        return this.getPrivateValue("center");
    }
    set center(center: XYZ) {
        this.setPropertyEmitShapeChanged("center", center);
    }

    @Serializer.serialze()
    @Property.define("arc.start")
    get start(): XYZ {
        return this.getPrivateValue("start");
    }

    @Serializer.serialze()
    get normal(): XYZ {
        return this.getPrivateValue("normal");
    }

    @Serializer.serialze()
    @Property.define("arc.angle")
    get angle() {
        return this.getPrivateValue("angle");
    }
    set angle(value: number) {
        this.setPropertyEmitShapeChanged("angle", value);
    }

    constructor(document: IDocument, normal: XYZ, center: XYZ, start: XYZ, angle: number) {
        super(document);
        this.setPrivateValue("normal", normal);
        this.setPrivateValue("center", center);
        this.setPrivateValue("start", start);
        this.setPrivateValue("angle", angle);
    }

    generateShape(): Result<IShape, string> {
        return this.document.application.shapeFactory.arc(this.normal, this.center, this.start, this.angle);
    }
}
