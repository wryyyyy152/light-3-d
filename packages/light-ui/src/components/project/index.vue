<template>
    <div :class="style.root">
        <div :class="style.headerPanel">
            <span :class="style.header" v-i18n="{ i18nKey: 'items.header' }"></span>
            <ToolBar :document="activeDocument"></ToolBar>
        </div>
        <div :class="style.itemsPanel">
            <Tree ref="treeRef" v-if="activeDocument" :document="activeDocument"></Tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {
    IDocument,
    IView
} from 'light-core';
import {
    PubSub,
} from "light-core";
import { onMounted, ref, toRaw } from 'vue';
import style from '../../styles/projectView.module.css';
import ToolBar from './ToolBar.vue';
import Tree from './tree/index.vue';

const activeDocument = ref<IDocument | undefined>();

onMounted(() => {
    PubSub.default.sub("activeViewChanged", handleActiveViewChanged);
    PubSub.default.sub("documentClosed", handleDocumentClosed);
})

const handleDocumentClosed = (document: IDocument) => {
    if (toRaw(activeDocument.value) === document) activeDocument.value = undefined
};
const handleActiveViewChanged = (view: IView | undefined) => {
    if (toRaw(activeDocument.value) === view?.document) return;

    activeDocument.value = view?.document;
};

const treeRef = ref<InstanceType<typeof Tree>>()
</script>