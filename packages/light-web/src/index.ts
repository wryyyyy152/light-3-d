// Part of the Light3d Project, under the AGPL-3.0 License.
// See LICENSE file in the project root for full license information.

import { AppBuilder } from "light-builder";
import { Logger } from "light-core";
import { Loading } from "./loading";

let loading = new Loading();
document.body.appendChild(loading);

// prettier-ignore
new AppBuilder()
    .useIndexedDB()
    .useWasmOcc()
    .useThree()
    .useUI()
    .build()
    .then(x => {
        document.body.removeChild(loading)
    })
    .catch((err) => {
        Logger.error(err);
    });
