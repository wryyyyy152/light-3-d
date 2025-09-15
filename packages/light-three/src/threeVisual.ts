import type { IDocument, IEventHandler, IMeshExporter, IVisual, } from "light-core";
import { IDisposable, Logger, Plane } from "light-core";
import { NodeSelectionHandler } from "light-vis";
import { AmbientLight, AxesHelper, Object3D, Scene } from "three";
import { ThreeMeshExporter } from "./meshExporter";
import { ThreeHighlighter } from "./threeHighlighter";
import { ThreeView } from "./threeView";
import { ThreeViewHandler } from "./threeViewEventHandler";
import { ThreeVisualContext } from "./threeVisualContext";

Object3D.DEFAULT_UP.set(0, 0, 1);

export class ThreeVisual implements IVisual {
    readonly defaultEventHandler: IEventHandler;
    readonly context: ThreeVisualContext;
    readonly scene: Scene;
    readonly highlighter: ThreeHighlighter;
    readonly viewHandler: IEventHandler;
    readonly meshExporter: IMeshExporter;
    private _eventHandler: IEventHandler;

    get eventHandler() {
        return this._eventHandler;
    }

    set eventHandler(value: IEventHandler) {
        if (this._eventHandler === value) return;
        this._eventHandler = value;
        Logger.info(`Changed EventHandler to ${Object.getPrototypeOf(value).constructor.name}`);
    }

    constructor(readonly document: IDocument) {
        this.scene = this.initScene();
        this.defaultEventHandler = this.createDefaultSelectionHandler(document);
        this.viewHandler = new ThreeViewHandler();
        this.context = new ThreeVisualContext(this, this.scene);
        this.highlighter = new ThreeHighlighter(this.context);
        this.meshExporter = new ThreeMeshExporter(this.context);
        this._eventHandler = this.defaultEventHandler;
    }

    protected createDefaultSelectionHandler(document: IDocument) {
        return new NodeSelectionHandler(document, true);
    }

    initScene() {
        let scene = new Scene();
        let envLight = new AmbientLight(0x888888, 4);
        let axisHelper = new AxesHelper(250);
        scene.add(envLight, axisHelper);
        return scene;
    }

    resetEventHandler() {
        this.eventHandler = this.defaultEventHandler;
    }

    isExcutingHandler(): boolean {
        return this.eventHandler !== this.defaultEventHandler;
    }

    createView(name: string, workplane: Plane) {
        return new ThreeView(this.document, name, workplane, this.highlighter, this.context);
    }

    update(): void {
        this.document.application.views.forEach((view) => {
            if (view.document === this.document) view.update();
        });
    }

    dispose() {
        this.context.dispose();
        this.defaultEventHandler.dispose();
        this._eventHandler.dispose();
        this.viewHandler.dispose();
        this.scene.traverse((x) => {
            if (IDisposable.isDisposable(x)) x.dispose();
        });
        this.scene.clear();
    }
}
