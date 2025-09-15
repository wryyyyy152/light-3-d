// Part of the Light3d Project, under the AGPL-3.0 License.
// See LICENSE file in the project root for full license information.

import type { IDocument } from "../document";
import type { IVisual } from "./visual";

export interface IVisualFactory {
    readonly kernelName: string;
    create(document: IDocument): IVisual;
}
