<template>
    <div class="rootPanel">
        <div class="headerPanel">
            <SvgIcon class="expanderIcon" :icon-name="getExpanderIcon()" @click="_handleExpanderClick($event)">
            </SvgIcon>
            <label class="headerText" v-i18n="{ i18nKey: props.header }"></label>
        </div>
        <div class="contextPanel" :class="{ 'hidden': !_isExpanded }">
            <template v-for="(control) in controls" :key="index">
                <component :is="control.component" v-bind="control.props" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { defineExpose, ref } from 'vue';
import type { controlType } from '../utils.ts';
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

const controls = ref<Array<controlType>>([])
const addItem = (con: controlType[]) => {
    controls.value.push(...con)
}

defineExpose({
    addItem
})
</script>