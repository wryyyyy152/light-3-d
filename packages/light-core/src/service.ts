// Part of the Light3d Project, under the AGPL-3.0 License.
// See LICENSE file in the project root for full license information.

import type { IApplication } from "./application";

export interface IService {
    register(app: IApplication): void;
    start(): void;
    stop(): void;
}
