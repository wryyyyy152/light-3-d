declare module "*.css" {
    const classes: any;
    export default classes;
}
declare module "*.module.css" {
    const classes: any;
    export default classes;
}

declare module "*.wasm" {
    const fun: string;
    export default fun;
}

declare module "*.cur" {
    const cur: string;
    export default cur;
}

declare module "*.svg" {
    const icon: string;
    export default icon;
}

declare module "*.jpg" {
    const path: string;
    export default path;
}

declare var __APP_VERSION__: string;
declare var __DOCUMENT_VERSION__: string;

// src/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        BASE_URL: string;
    }
}

declare interface HTMLElement {
    _v_i18n_updated?: () => void;
}