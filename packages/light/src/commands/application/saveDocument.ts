import type { IApplication } from "light-core";
import { command, I18n, ICommand, PubSub } from "light-core";

@command({
    key: "doc.save",
    icon: "icon-save",
    isApplicationCommand: true,
})
export class SaveDocument implements ICommand {
    async execute(app: IApplication): Promise<void> {
        if (!app.activeView?.document) return;
        PubSub.default.pub(
            "showPermanent",
            async () => {
                await app.activeView?.document!.save();
                PubSub.default.pub("showToast", "toast.document.saved");
            },
            "toast.excuting{0}",
            I18n.translate("command.doc.save"),
        );
    }
}
