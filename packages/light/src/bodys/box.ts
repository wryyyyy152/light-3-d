import type {
    I18nKeys,
    IDocument,
    IShape,
} from "light-core";
import {
    ParameterShapeNode,
    Plane,
    Property,
    Result,
    Serializer,
} from "light-core";

@Serializer.register(["document", "plane", "dx", "dy", "dz"])
export class BoxNode extends ParameterShapeNode {
    override display(): I18nKeys {
        return "body.box";
    }

    @Serializer.serialze()
    @Property.define("box.dx")
    get dx() {
        return this.getPrivateValue("dx");
    }
    set dx(dx: number) {
        this.setPropertyEmitShapeChanged("dx", dx);
    }

    @Serializer.serialze()
    @Property.define("box.dy")
    get dy() {
        return this.getPrivateValue("dy");
    }
    set dy(dy: number) {
        this.setPropertyEmitShapeChanged("dy", dy);
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
    get plane(): Plane {
        return this.getPrivateValue("plane");
    }

    constructor(document: IDocument, plane: Plane, dx: number, dy: number, dz: number) {
        super(document);
        this.setPrivateValue("plane", plane);
        this.setPrivateValue("dx", dx);
        this.setPrivateValue("dy", dy);
        this.setPrivateValue("dz", dz);
    }

    generateShape(): Result<IShape> {
        return this.document.application.shapeFactory.box(this.plane, this.dx, this.dy, this.dz);
    }
}
