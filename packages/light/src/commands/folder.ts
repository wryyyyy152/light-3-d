import type { IApplication, } from "light-core";
import { command, FolderNode, ICommand } from "light-core";

let index = 1;

@command({
    key: "create.folder",
    icon: "icon-folder-plus",
})
export class NewFolder implements ICommand {
    async execute(app: IApplication): Promise<void> {
        const document = app.activeView?.document!;
        const folder = new FolderNode(document, `Folder${index++}`);
        document.addNode(folder);
    }
}
