<template>
    <div class="root">
        <div class="headerPanel">
            <span class="header" v-i18n="{ i18nKey: 'items.header' }"></span>
            <ToolBar :document="activeDocument"></ToolBar>
        </div>
        <div class="itemsPanel">
            <Tree ref="treeRef" v-if="activeDocument" :document="activeDocument"></Tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {
    IDocument,
    INode,
    IView
} from 'light-core';
import {
    PubSub,
} from "light-core";
import { onMounted, provide, ref, toRaw } from 'vue';
import ToolBar from './ToolBar.vue';
import Tree from './tree/index.vue';
import type TreeItem from './tree/TreeItem.vue';

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
const getTreeItem = (node: INode): InstanceType<typeof TreeItem> | undefined =>{
    if (!treeRef.value) return
    return treeRef.value.treeItem(node)
}
provide('getTreeItem', getTreeItem)
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    flex-direction: column;
}

.headerPanel {
    display: flex;
    flex-direction: row;
    align-items: end;
    flex: 0;
    margin: 0px 12px;
}

.itemsPanel {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    border-top: 2px solid transparent;
    border-bottom: 2px solid transparent;
    background-color: var(--panel-background-color);
}

.header {
    display: flex;
    flex-direction: row;
    font-size: 1.15rem;
    font-weight: bolder;
    flex: 1;
    margin: 2px 6px;
}
</style>
<style lang="scss">
@media (max-width: 680px) {
    .root {
        display: none;
    }
}
</style>