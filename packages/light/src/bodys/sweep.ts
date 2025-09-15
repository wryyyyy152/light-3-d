import type {
    I18nKeys,
    IDocument,
    IEdge,
    IShape,
    IWire
} from "light-core";
import {
    ParameterShapeNode,
    Result,
    Serializer,
    ShapeType,
} from "light-core";

@Serializer.register(["document", "profile", "path", "round"])
export class SweepedNode extends ParameterShapeNode {
    override display(): I18nKeys {
        return "body.sweep";
    }

    @Serializer.serialze()
    get profile() {
        return this.getPrivateValue("profile");
    }
    set profile(value: IShape[]) {
        this.setPropertyEmitShapeChanged("profile", value);
    }

    @Serializer.serialze()
    get path() {
        return this.getPrivateValue("path");
    }
    set path(value: IWire) {
        this.setPropertyEmitShapeChanged("path", value);
    }

    @Serializer.serialze()
    get round() {
        return this.getPrivateValue("round");
    }
    set round(value: boolean) {
        this.setPropertyEmitShapeChanged("round", value);
    }

    constructor(document: IDocument, profile: (IWire | IEdge)[], path: IWire | IEdge, round: boolean) {
        super(document);
        this.setPrivateValue(
            "profile",
            profile.map((p) => this.ensureWire(p)),
        );
        this.setPrivateValue("path", this.ensureWire(path));
        this.setPrivateValue("round", round);
    }

    private ensureWire(path: IEdge | IWire) {
        let wire = path as IWire;
        if (path.shapeType !== ShapeType.Wire) {
            wire = this.document.application.shapeFactory.wire([path as unknown as IEdge]).value;
        }
        return wire;
    }

    override generateShape(): Result<IShape> {
        return this.document.application.shapeFactory.sweep(this.profile, this.path, this.round);
    }
}
