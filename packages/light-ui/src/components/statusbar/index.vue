<template>
    <div :class="style.panel">
        <div :class="style.left">
            <label :class="style.tip">{{ textContent }}</label>
        </div>
        <div :class="style.right">
            <SnapConfig></SnapConfig>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { Config, I18n, Navigation3D, PubSub } from 'light-core';
import { ref } from 'vue';
import style from '../../styles/statusbar.module.css';
import SnapConfig from './SnapConfig.vue';

const _isDefaultTip = ref<boolean>(true);
const textContent = ref()

const setDefaultTip = () => {
    _isDefaultTip.value = true;
    const { pan, rotate } = Navigation3D.navigationKeyMap();
    textContent.value = I18n.translate("prompt.default{0}{1}", [pan, rotate])
};

const handleConfigChanged = (prop: keyof Config) => {
    if (prop === "navigation3DIndex" && _isDefaultTip.value) {
        setDefaultTip();
    }
};

const statusBarTip = (tip: I18nKeys) => {
    _isDefaultTip.value = false;
    textContent.value=I18n.translate(tip)
};

const init = () => {
    setDefaultTip();
    PubSub.default.sub("statusBarTip", statusBarTip);
    PubSub.default.sub("clearStatusBarTip", setDefaultTip);
    Config.instance.onPropertyChanged(handleConfigChanged);
}
init()
</script>