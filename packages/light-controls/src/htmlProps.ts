import type { IPropertyChanged } from "light-core";
import { Localize, PathBinding } from "light-core";

export type HTMLProps<T> = {
    [P in keyof T]?: T[P] extends object
    ? HTMLProps<T[P]>
    : (T[P] | PathBinding<IPropertyChanged>) | (P extends "textContent" | "title" ? Localize : never);
};
