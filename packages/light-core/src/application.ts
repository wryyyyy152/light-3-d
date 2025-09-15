import { ICommand } from "./command";
import type { IDataExchange } from "./dataExchange";
import type { IDocument } from "./document";
import type { IStorage } from "./foundation";
import { ObservableCollection } from "./foundation";
import type { Serialized } from "./serialize";
import type { IService } from "./service";
import type { IShapeFactory } from "./shape";
import type { IVisualFactory } from "./visual";
import { IView } from "./visual";

export interface IApplication {
    readonly mainWindow?: any;
    readonly dataExchange: IDataExchange;
    readonly visualFactory: IVisualFactory;
    readonly shapeFactory: IShapeFactory;
    readonly services: IService[];
    readonly storage: IStorage;
    readonly views: ObservableCollection<IView>;
    readonly documents: Set<IDocument>;
    executingCommand: ICommand | undefined;
    activeView: IView | undefined;
    newDocument(name: string): Promise<IDocument>;
    openDocument(id: string): Promise<IDocument | undefined>;
    loadDocument(data: Serialized): Promise<IDocument | undefined>;
}
