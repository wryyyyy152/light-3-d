import type { IApplication } from "../application";
import type { CommandKeys } from "../command";
import type { I18nKeys } from "../i18n";
import type { Button } from "./button";

export interface IWindow {
    init(app: IApplication): void;
    registerHomeCommand(groupName: I18nKeys, command: CommandKeys | Button): void;
    registerRibbonCommand(tabName: I18nKeys, groupName: I18nKeys, command: CommandKeys | Button): void;
}
