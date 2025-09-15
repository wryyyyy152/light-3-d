<template>
    <!-- 基础按钮结构 -->
    <div ref="buttonRef" :class="buttonClassName" v-i18n:title="{ i18nKey: props.display }" @click="props.onClick">
        <svg-icon :icon-name="props.icon" :class="getSvgClass()"></svg-icon>
        <label class="buttonText" v-i18n="{ i18nKey: props.display }"></label>
    </div>
</template>

<script setup lang="ts">
import type {
    CommandData,
    CommandKeys,
    I18nKeys,
} from "light-core";
import {
    ButtonSize
} from "light-core";
import { computed, onMounted, ref } from 'vue';
import SvgIcon from "../common/SvgIcon.vue";

// 组件属性
const props = defineProps<{
    // 基础属性
    display: I18nKeys,
    icon: string;
    size: ButtonSize;
    onClick?: () => void;

    // 命令相关
    commandName?: CommandKeys;

    // 切换按钮相关
    isToggle?: boolean;
    toggleData?: CommandData['toggle'];
}>();

const buttonClassName = computed(() => {
    return props.size === ButtonSize.large ? 'normal' : 'small';
})

const getSvgClass = (): string => {
    return props.size === ButtonSize.large ? 'icon' : 'smallIcon';
}

const buttonRef = ref(null)
onMounted(() => {
    if (props.toggleData) {
        // data.toggle.converter = new ToggleConverter(this.className, style.checked);
        // data.toggle.setBinding(this, "className");

        // todo
    }
})
</script>

<style lang="scss" scoped>
.normal {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px;
    margin: 4px;
    border-radius: 4px;
    max-width: 42px;
}

.normal:hover {
    opacity: 0.85;
    background-color: var(--hover-background-color);
}

.normal:active {
    background-color: var(--active-background-color);
}

.small {
    display: flex;
    flex-direction: row;
    justify-items: top;
    padding: 4px;
    margin: 0px 4px;
    min-width: 80px;
    max-width: 100px;
}

.checked {
    background-color: var(--checked-color);
}

.small:hover {
    opacity: 0.85;
    background-color: var(--hover-background-color);
}

.small:active {
    background-color: var(--active-background-color);
}

.buttonText {
    color: var(--foreground-color);
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    text-wrap: nowrap;
}

.icon {
    width: 30px;
    height: 30px;
    margin-bottom: 4px;
}

.smallIcon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
}
</style>