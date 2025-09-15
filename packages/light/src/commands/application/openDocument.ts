import type { IApplication, Serialized } from "light-core";
import { I18n, ICommand, PubSub, command, readFileAsync } from "light-core";

@command({
    key: "doc.open",
    icon: "icon-open",
    isApplicationCommand: true,
})
export class OpenDocument implements ICommand {
    async execute(app: IApplication): Promise<void> {
        PubSub.default.pub(
            "showPermanent",
            async () => {
                let files = await readFileAsync(".cd", false);
                if (files.isOk) {
                    let json: Serialized = JSON.parse(files.value[0].data);
                    let document = await app.loadDocument(json);
                    document?.application.activeView?.cameraController.fitContent();
                }
            },
            "toast.excuting{0}",
            I18n.translate("command.doc.open"),
        );
    }
}
