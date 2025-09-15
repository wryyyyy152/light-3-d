import type { IApplication, IDocument, IEventHandler, IService } from "light-core";
import { INode, Logger, PubSub } from "light-core";

export class EditorService implements IService {
    private editHandler?: IEventHandler;

    constructor(readonly factory: (document: IDocument, selected: INode[]) => IEventHandler) { }

    register(_app: IApplication): void {
        Logger.info(`${EditorService.name} registed`);
    }

    start(): void {
        PubSub.default.sub("selectionChanged", this.handleSelectionChanged);
        Logger.info(`${EditorService.name} started`);
    }

    stop(): void {
        PubSub.default.remove("selectionChanged", this.handleSelectionChanged);
        Logger.info(`${EditorService.name} stopped`);
    }

    private readonly handleSelectionChanged = (document: IDocument, selected: INode[]) => {
        this.editHandler?.dispose();
        this.editHandler = undefined;

        if (document.application.executingCommand) return;

        if (selected.length > 0) {
            this.editHandler = this.factory(document, selected);
            document.visual.eventHandler = this.editHandler;
        } else {
            document.visual.resetEventHandler();
        }
    };
}
