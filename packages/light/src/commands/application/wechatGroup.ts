import { div, img, label } from "light-controls";
import type { IApplication } from "light-core";
import { ICommand, PubSub, command } from "light-core";

@command({
    key: "wechat.group",
    icon: "icon-qrcode",
    isApplicationCommand: true,
})
export class WeChatGroup implements ICommand {
    async execute(app: IApplication): Promise<void> {
        PubSub.default.pub("showDialog", "command.wechat.group", this.ui());
    }

    private ui() {
        return div(
            label({
                textContent: "Light3d交流群",
                style: {
                    fontSize: "16px",
                    display: "block",
                    textAlign: "center",
                    marginBottom: "10px",
                },
            }),
            img({
                width: 360,
                src: "images/wechat-group.jpg",
                style: {
                    borderRadius: "10px",
                },
            }),
        );
    }
}
