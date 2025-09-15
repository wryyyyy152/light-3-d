import type { IConverter } from "../foundation";
import { Observable, ObservableCollection } from "../foundation";

export class Combobox<T> extends Observable {
    constructor(readonly converter?: IConverter<T>) {
        super();
    }

    get selectedIndex(): number {
        return this.getPrivateValue("selectedIndex", 0);
    }
    set selectedIndex(value: number) {
        if (value < 0 || value >= this.items.length) {
            return;
        }

        this.setProperty("selectedIndex", value);
    }

    get selectedItem(): T | undefined {
        return this.items.at(this.selectedIndex);
    }

    readonly items = new ObservableCollection<T>();
}
