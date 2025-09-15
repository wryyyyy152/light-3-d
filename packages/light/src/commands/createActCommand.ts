import type { IApplication, } from "light-core";
import { Act, I18n, ICommand, command } from "light-core";

let index = 0;

@command({
    key: "act.alignCamera",
    icon: "icon-act",
})
export class ActAlignCameraCommand implements ICommand {
    async execute(application: IApplication): Promise<void> {
        const view = application.activeView;
        if (!view) return;

        view.document.acts.push(
            new Act(
                `${I18n.translate("ribbon.group.act")} ${index++}`,
                view.cameraController.cameraPosition,
                view.cameraController.cameraTarget,
                view.cameraController.cameraUp,
            ),
        );
    }
}
