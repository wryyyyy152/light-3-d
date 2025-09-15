import type { IApplication } from "light-core";
import { ICommand, command } from "light-core";

let count = 1;

@command({
    key: "doc.new",
    icon: "icon-new",
    isApplicationCommand: true,
})
export class NewDocument implements ICommand {
    async execute(app: IApplication): Promise<void> {
        await app.newDocument(`undefined ${count++}`);
    }
}
