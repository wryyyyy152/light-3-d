import type { IDocument, } from "light-core";
import { INode, PubSub } from "light-core";
import { NodeSelectionHandler } from "light-vis";

export class EditEventHandler extends NodeSelectionHandler {
    constructor(
        document: IDocument,
        readonly selectedNodes: INode[],
    ) {
        super(document, true);
        PubSub.default.pub("showProperties", document, selectedNodes);
    }

    override disposeInternal() {
        PubSub.default.pub("showProperties", this.document, []);
        super.disposeInternal();
    }
}
