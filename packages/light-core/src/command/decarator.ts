import { Binding } from "../foundation";
import { ICommand } from "./command";
import type { CommandKeys } from "./commandKeys";

const commandRegistry = new Map<string, CommandConstructor>();

export type CommandConstructor = new (...args: any[]) => ICommand;

export interface CommandData {
    key: CommandKeys;
    icon: string;
    toggle?: Binding;
    helpText?: string;
    helpUrl?: string;
    isApplicationCommand?: boolean;
}

export function command<T extends CommandConstructor>(metadata: CommandData) {
    return (constructor: T) => {
        commandRegistry.set(metadata.key, constructor);
        constructor.prototype.data = metadata;
    };
}

export namespace Command {
    export function getData(target: string | ICommand | CommandConstructor): CommandData | undefined {
        if (typeof target === "string") {
            const constructor = commandRegistry.get(target);
            return constructor?.prototype.data;
        }

        const prototype = typeof target === "function" ? target.prototype : Object.getPrototypeOf(target);

        return prototype.data;
    }

    export function get(name: CommandKeys): CommandConstructor | undefined {
        return commandRegistry.get(name);
    }
}
