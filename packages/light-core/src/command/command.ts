import type { IApplication } from "../application";
import { AsyncController, IDisposable, Observable, PubSub } from "../foundation";
import { Property } from "../property";

export interface ICommand {
    execute(application: IApplication): Promise<void>;
}

export interface ICanclableCommand extends ICommand, IDisposable {
    cancel(): Promise<void>;
}

export namespace ICommand {
    export function isCancelableCommand(command: ICommand): command is ICanclableCommand {
        return "cancel" in command;
    }
}

export abstract class CancelableCommand extends Observable implements ICanclableCommand {
    private static readonly _propertiesCache: Map<string, any> = new Map(); // 所有命令共享
    protected readonly disposeStack: Set<IDisposable> = new Set();

    private _isCompleted: boolean = false;
    get isCompleted() {
        return this._isCompleted;
    }

    private _isCanceled: boolean = false;
    get isCanceled() {
        return this._isCanceled;
    }

    private _application: IApplication | undefined;
    get application() {
        if (!this._application) {
            throw new Error("application is not set");
        }
        return this._application;
    }

    get document() {
        return this.application.activeView?.document!;
    }

    #controller?: AsyncController;
    protected get controller() {
        return this.#controller;
    }
    protected set controller(value: AsyncController | undefined) {
        if (this.#controller === value) return;
        this.#controller?.dispose();
        this.#controller = value;
    }

    @Property.define("common.cancel")
    async cancel() {
        this._isCanceled = true;

        this.controller?.cancel();
        while (!this._isCompleted) {
            await new Promise((r) => setTimeout(r, 30));
        }
    }

    @Property.define("option.command.repeat")
    get repeatOperation() {
        return this.getPrivateValue("repeatOperation", false);
    }

    set repeatOperation(value: boolean) {
        this.setProperty("repeatOperation", value);
    }

    protected _isRestarting: boolean = false;
    protected async restart() {
        this._isRestarting = true;
        await this.cancel();
    }

    protected onRestarting() {}

    async execute(application: IApplication): Promise<void> {
        if (!application.activeView?.document) return;
        this._application = application;
        try {
            this.beforeExecute();

            await this.executeAsync();

            while (this._isRestarting || (!this.checkCanceled() && this.repeatOperation)) {
                this._isRestarting = false;

                this.onRestarting();
                await this.executeAsync();
            }
        } finally {
            this.afterExecute();
        }
    }

    protected checkCanceled() {
        if (this.isCanceled) {
            return true;
        }

        if (this.controller?.result?.status === "cancel") {
            return true;
        }

        return false;
    }

    protected abstract executeAsync(): Promise<void>;

    protected beforeExecute() {
        this.readProperties();
        PubSub.default.pub("openCommandContext", this);
    }

    protected afterExecute() {
        this.saveProperties();
        PubSub.default.pub("closeCommandContext");
        this.controller?.dispose();
        this.disposeStack.forEach((x) => x.dispose());
        this.disposeStack.clear();
        this._isCompleted = true;
    }

    private readProperties() {
        Property.getProperties(this).forEach((x) => {
            let key = this.cacheKeyOfProperty(x);
            if (CancelableCommand._propertiesCache.has(key)) {
                this.setPrivateValue(key as keyof this, CancelableCommand._propertiesCache.get(key));
            }
        });
    }

    private saveProperties() {
        Property.getProperties(this).forEach((x) => {
            let key = this.cacheKeyOfProperty(x);
            let prop = (this as any)[key];
            if (typeof prop === "function") return;
            CancelableCommand._propertiesCache.set(key, prop);
        });
    }

    private cacheKeyOfProperty(property: Property) {
        return property.name;
    }
}