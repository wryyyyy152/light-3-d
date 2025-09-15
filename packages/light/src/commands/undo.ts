import type { IApplication, } from "light-core";
import { command, ICommand } from "light-core";

@command({
    key: "edit.undo",
    icon: "icon-undo",
})
export class Undo implements ICommand {
    async execute(application: IApplication): Promise<void> {
        const document = application.activeView?.document;
        document?.history.undo();
        document?.visual.update();
    }
}
