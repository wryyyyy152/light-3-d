import type { I18nKeys, IDocument, IEdge, IShape } from "light-core";
import { ParameterShapeNode, Result, Serializer } from "light-core";

@Serializer.register(["document", "edges"])
export class WireNode extends ParameterShapeNode {
    override display(): I18nKeys {
        return "body.wire";
    }

    @Serializer.serialze()
    get edges(): IEdge[] {
        return this.getPrivateValue("edges");
    }
    set edges(values: IEdge[]) {
        this.setPropertyEmitShapeChanged("edges", values);
    }

    constructor(document: IDocument, edges: IEdge[]) {
        super(document);
        this.setPrivateValue("edges", edges);
    }

    override generateShape(): Result<IShape> {
        return this.document.application.shapeFactory.wire(this.edges);
    }
}
