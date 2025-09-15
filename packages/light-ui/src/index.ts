import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
// 全局组件
import type { IApplication, RibbonTab } from "light-core";
import SvgIcon from './components/common/SvgIcon.vue';
import { registerI18nDirective } from './utils/i18n';

export function createMainWindow(application: IApplication, tabs: RibbonTab[]): any {
    const app = createApp(App, {
        application,
        tabs
    })

    app.use(createPinia())
    app.use(router)
    const mainWindow = app.mount('#app')
    app.component('SvgIcon', SvgIcon);
    registerI18nDirective(app); 

    return mainWindow;
}