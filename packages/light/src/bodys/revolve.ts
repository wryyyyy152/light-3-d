import type { I18nKeys, IDocument, IShape } from "light-core";
import { ParameterShapeNode, Ray, Result, Serializer } from "light-core";

@Serializer.register(["document", "profile", "axis", "angle"])
export class RevolvedNode extends ParameterShapeNode {
    override display(): I18nKeys {
        return "body.revol";
    }

    @Serializer.serialze()
    get profile() {
        return this.getPrivateValue("profile");
    }
    set profile(value: IShape) {
        this.setPropertyEmitShapeChanged("profile", value);
    }

    @Serializer.serialze()
    get axis() {
        return this.getPrivateValue("axis");
    }
    set axis(value: Ray) {
        this.setPropertyEmitShapeChanged("axis", value);
    }

    @Serializer.serialze()
    get angle() {
        return this.getPrivateValue("angle");
    }
    set angle(value: number) {
        this.setPropertyEmitShapeChanged("angle", value);
    }

    constructor(document: IDocument, profile: IShape, axis: Ray, angle: number) {
        super(document);
        this.setPrivateValue("profile", profile);
        this.setPrivateValue("axis", axis);
        this.setPrivateValue("angle", angle);
    }

    override generateShape(): Result<IShape> {
        return this.document.application.shapeFactory.revolve(this.profile, this.axis, this.angle);
    }
}
