import type { IEqualityComparer } from "light-core";
import { Precision, XYZ } from "light-core";

export class XYZEqualityComparer implements IEqualityComparer<XYZ> {
    constructor(readonly tolerance: number = Precision.Distance) { }

    equals(left: XYZ, right: XYZ): boolean {
        return left.isEqualTo(right, this.tolerance);
    }
}
