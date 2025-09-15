import type { IApplication } from "light-core";
import { Binding, Config, ICommand, command } from "light-core";

@command({
    key: "workingPlane.toggleDynamic",
    toggle: new Binding(Config.instance, "dynamicWorkplane"),
    icon: "icon-dynamicPlane",
})
export class ToggleDynamicWorkplaneCommand implements ICommand {
    async execute(app: IApplication): Promise<void> {
        Config.instance.dynamicWorkplane = !Config.instance.dynamicWorkplane;
    }
}
