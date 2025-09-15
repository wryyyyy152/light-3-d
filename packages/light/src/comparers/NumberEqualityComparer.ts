import type { IEqualityComparer } from "light-core";
import { Precision } from "light-core";

export class NumberEqualityComparer implements IEqualityComparer<number> {
    constructor(readonly tolerance: number = Precision.Distance) { }

    equals(left: number, right: number): boolean {
        return Math.abs(left - right) < this.tolerance;
    }
}
