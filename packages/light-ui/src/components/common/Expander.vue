<template>
    <div :class="style.rootPanel">
        <div :class="style.headerPanel">
            <SvgIcon :class="style.expanderIcon" :icon-name="getExpanderIcon()" @click="_handleExpanderClick($event)">
            </SvgIcon>
            <label :class="style.headerText" v-i18n="{ i18nKey: props.header }"></label>
        </div>
        <div :class="{ [style.contextPanel]: true, [style.hidden]: !_isExpanded }">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { ref } from 'vue';
import style from '../../styles/expander.module.css';
import SvgIcon from './SvgIcon.vue';

const props = defineProps<{
    header: I18nKeys
}>();

const _isExpanded = ref<boolean>(true)

const getExpanderIcon = () => {
    return _isExpanded.value ? "icon-angle-down" : "icon-angle-right";
}

const _handleExpanderClick = (e: MouseEvent) => {
    e.stopPropagation();
    _isExpanded.value = !_isExpanded.value;
};
</script>