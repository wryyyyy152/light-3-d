import type { I18nKeys } from 'light-core';
import { I18n, PubSub } from 'light-core';
import type { App, DirectiveBinding } from 'vue';

// 存储元素与参数的映射（替代原I18nArgs）
const elementArgs = new Map<HTMLElement, any[]>();

// 自定义指令逻辑
export const i18nDirective = {
    // 指令绑定到元素时触发
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const prop = binding.arg || 'innerText'
        const { i18nKey, i18nArgs = [] } = binding.value;
        if (!i18nKey) return;

        elementArgs.set(el, i18nArgs);

        el._v_i18n_updated = () => {
            updateTranslation(el, prop, i18nKey as I18nKeys);
        };

        updateTranslation(el, prop, i18nKey as I18nKeys);
    },

    // 指令所在组件更新时触发（如语言切换）
    updated(el: HTMLElement, binding: DirectiveBinding) {
        const prop = binding.arg || 'innerText'

        const { i18nKey, i18nArgs = [] } = binding.value; // 重新获取最新参数
        if (!i18nKey) return;

        elementArgs.set(el, i18nArgs); // 更新参数
        updateTranslation(el, prop, i18nKey as I18nKeys);
    },

    // 元素卸载时清理
    unmounted(el: HTMLElement) {
        elementArgs.delete(el);
    }
};

function updateTranslation(el: HTMLElement, prop: string, key: I18nKeys,) {
    const args = elementArgs.get(el) || [];
    (el as any)[prop] = I18n.translate(key, args);
}

function handleChangeLanguage() {
    // 直接遍历 elementArgs 的 key（所有绑定的元素）
    elementArgs.forEach((_, el) => {
        el._v_i18n_updated?.();
    });
}

// 注册全局指令
export function registerI18nDirective(app: App) {
    app.directive('i18n', i18nDirective);

    PubSub.default.sub('changeLanguage', handleChangeLanguage)
}