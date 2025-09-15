import type { IApplication } from "./application";
import type {
    INodeChangedObserver,
    IPropertyChanged,
    NodeRecord,
} from "./foundation";
import {
    History,
    IDisposable,
    ObservableCollection,
} from "./foundation";
import { Material } from "./material";
import type { INodeLinkedList } from "./model";
import { Component, INode } from "./model";
import type { ISelection } from "./selection";
import type { ISerialize, Serialized } from "./serialize";
import type { IVisual } from "./visual";
import { Act } from "./visual";

export const DOCUMENT_FILE_EXTENSION = ".cd";

export interface IDocument extends IPropertyChanged, IDisposable, ISerialize {
    name: string;
    currentNode?: INodeLinkedList;
    rootNode: INodeLinkedList;
    readonly selection: ISelection;
    readonly id: string;
    readonly history: History;
    readonly visual: IVisual;
    readonly application: IApplication;
    readonly components: Array<Component>;
    materials: ObservableCollection<Material>;
    acts: ObservableCollection<Act>;
    addNode(...nodes: INode[]): void;
    addNodeObserver(observer: INodeChangedObserver): void;
    removeNodeObserver(observer: INodeChangedObserver): void;
    notifyNodeChanged(records: NodeRecord[]): void;
    save(): Promise<void>;
    close(): Promise<void>;
    serialize(): Serialized;
}
