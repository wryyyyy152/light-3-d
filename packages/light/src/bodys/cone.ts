import type {
    I18nKeys,
    IDocument,
    IShape,
} from "light-core";
import {
    ParameterShapeNode,
    Property,
    Result,
    Serializer,
    XYZ,
} from "light-core";

@Serializer.register(["document", "normal", "center", "radius", "dz"])
export class ConeNode extends ParameterShapeNode {
    override display(): I18nKeys {
        return "body.cone";
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
    @Property.define("circle.radius")
    get radius() {
        return this.getPrivateValue("radius");
    }
    set radius(dy: number) {
        this.setPropertyEmitShapeChanged("radius", dy);
    }

    @Serializer.serialze()
    @Property.define("box.dz")
    get dz() {
        return this.getPrivateValue("dz");
    }
    set dz(dz: number) {
        this.setPropertyEmitShapeChanged("dz", dz);
    }

    @Serializer.serialze()
    get normal(): XYZ {
        return this.getPrivateValue("normal");
    }

    constructor(document: IDocument, normal: XYZ, center: XYZ, radius: number, dz: number) {
        super(document);
        this.setPrivateValue("normal", normal);
        this.setPrivateValue("center", center);
        this.setPrivateValue("radius", radius);
        this.setPrivateValue("dz", dz);
    }

    generateShape(): Result<IShape> {
        return this.document.application.shapeFactory.cone(
            this.normal,
            this.center,
            this.radius,
            0,
            this.dz,
        );
    }
}
