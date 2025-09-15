import type { I18nKeys } from "../i18n";

export type CommandKeys = {
    [P in I18nKeys]: P extends `command.${infer K}` ? K : never;
}[I18nKeys];
