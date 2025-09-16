<template>
    <!-- 基础按钮结构 -->
    <div ref="buttonRef" :class="buttonClassName" v-i18n:title="{ i18nKey: props.display }" @click="props.onClick">
        <svg-icon :icon-name="props.icon" :class="getSvgClass()"></svg-icon>
        <label :class="style.buttonText" v-i18n="{ i18nKey: props.display }"></label>
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
import style from '../../styles/ribbonButton.module.css';
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
    return props.size === ButtonSize.large ? style.normal : style.small;
})

const getSvgClass = (): string => {
    return props.size === ButtonSize.large ? style.icon : style.smallIcon;
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