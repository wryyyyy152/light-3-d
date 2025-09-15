import type { I18nKeys, IDocument, IShape } from "light-core";
import { ParameterShapeNode, Property, Result, Serializer } from "light-core";
import { GeoUtils } from "light-geo";

@Serializer.register(["document", "section", "length"])
export class PrismNode extends ParameterShapeNode {
    override display(): I18nKeys {
        return "body.prism";
    }

    @Serializer.serialze()
    get section(): IShape {
        return this.getPrivateValue("section");
    }
    set section(value: IShape) {
        this.setPropertyEmitShapeChanged("section", value);
    }

    @Serializer.serialze()
    @Property.define("common.length")
    get length(): number {
        return this.getPrivateValue("length");
    }
    set length(value: number) {
        this.setPropertyEmitShapeChanged("length", value);
    }

    constructor(document: IDocument, face: IShape, length: number) {
        super(document);
        this.setPrivateValue("section", face);
        this.setPrivateValue("length", length);
    }

    override generateShape(): Result<IShape> {
        let normal = GeoUtils.normal(this.section as any);
        let vec = normal.multiply(this.length);
        return this.document.application.shapeFactory.prism(this.section, vec);
    }
}
