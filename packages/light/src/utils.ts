import type { IApplication } from "light-core";
import { I18n, PubSub, Transaction } from "light-core";

export async function importFiles(application: IApplication, files: File[] | FileList) {
    let document = application.activeView?.document ?? (await application.newDocument("Untitled"));
    PubSub.default.pub(
        "showPermanent",
        async () => {
            await Transaction.executeAsync(document, "import model", async () => {
                await document.application.dataExchange.import(document, files);
            });
            document.application.activeView?.cameraController.fitContent();
        },
        "toast.excuting{0}",
        I18n.translate("command.file.import"),
    );
}
