<template>
    <div :class="`root ${props.className}`">
        <div class="headerPanel">
            <span class="header" v-i18n="{ i18nKey: 'items.header' }"></span>
            <ToolBar></ToolBar>
        </div>
        <div class="itemsPanel">

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
import { defineExpose, onMounted, provide } from 'vue';
import ToolBar from './ToolBar.vue';
import Tree from './tree/index.vue';

const props = defineProps<{
    className: string
}>();

let _activeDocument: IDocument | undefined = undefined;
provide<IDocument|undefined>('activeDocument', _activeDocument)

onMounted(() => {
    PubSub.default.sub("activeViewChanged", handleActiveViewChanged);
    PubSub.default.sub("documentClosed", handleDocumentClosed);
})

const _documentTreeMap = new Map<IDocument, InstanceType<typeof Tree>>();

const handleDocumentClosed = (document: IDocument) => {
    const tree = _documentTreeMap.get(document);
    if (tree) {
        // todo:

        // tree.remove();
        // tree.dispose();
        // _documentTreeMap.delete(document);
    }
};

const handleActiveViewChanged = (view: IView | undefined) => {
    if (_activeDocument === view?.document) return;

    _activeDocument = view?.document;

    // todo
};

defineExpose({

})
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

@media (max-width: 680px) {
    .root {
        display: none;
    }
}
</style>