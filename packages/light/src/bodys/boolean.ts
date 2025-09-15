import type { I18nKeys, IDocument, IShape, } from "light-core";
import { ParameterShapeNode, Result, Serializer } from "light-core";

@Serializer.register(["document", "booleanShape"])
export class BooleanNode extends ParameterShapeNode {
    override display(): I18nKeys {
        return "body.bolean";
    }

    @Serializer.serialze()
    get booleanShape(): IShape {
        return this.getPrivateValue("booleanShape");
    }

    constructor(document: IDocument, shape: IShape) {
        super(document);
        this.setPrivateValue("booleanShape", shape);
    }

    override generateShape(): Result<IShape> {
        return Result.ok(this.booleanShape);
    }
}
