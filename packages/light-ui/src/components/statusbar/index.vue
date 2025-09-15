<template>
    <div class="panel">
        <div class="left">
            <label class="tip">{{ textContent }}</label>
        </div>
        <div class="right">
            <SnapConfig></SnapConfig>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { Config, I18n, Navigation3D, PubSub } from 'light-core';
import { ref } from 'vue';
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

<style lang="scss" scoped>
.panel {
    background: var(--statusbar-background-color);
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
}

.left {
    flex: 1;

    .tip {
        font-size: 12px;
        margin: 4px 8px;
        color: var(--statusbar-foreground-color);
    }
}

.right {
    flex: 0 1 auto;
}
</style>
<style lang="scss">
@media (max-width: 680px) {
    .right {
        display: none;
    }
}
</style>