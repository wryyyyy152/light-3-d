<template>
    <div class="panel">
        <template v-for="b in buttons">
            <a>{{ I18n.translate(b.tip) }}</a>
            <SvgIcon :icon-name="b.icon" class="svg" @click="b.command"></SvgIcon>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys, IDocument } from 'light-core';
import { I18n, INode, PubSub } from 'light-core';
import { inject, ref } from 'vue';
import SvgIcon from '../common/SvgIcon.vue';

interface button {
    icon: string,
    tip: I18nKeys,
    command: () => void
}

const newGroup = () => {
    PubSub.default.pub("executeCommand", "create.folder");
};

const expandAll = () => {
    setExpand(true);
};

const unExpandAll = () => {
    setExpand(false);
};

const activeDocument = inject<IDocument | undefined>('activeDocument')

const setExpand = (expand: boolean) => {
    let first = activeDocument?.rootNode.firstChild;
    if (first) setNodeExpand(first, expand);
}

const setNodeExpand = (list: INode, expand: boolean) => {
    // todo 
    
    // let item = tree.treeItem(list);
    // if (item instanceof TreeGroup) {
    //     item.isExpanded = expand;
    // }
    if (INode.isLinkedListNode(list) && list.firstChild) {
        setNodeExpand(list.firstChild, expand);
    }
    if (list.nextSibling) {
        setNodeExpand( list.nextSibling, expand);
    }
}

const buttons = ref<button[]>([
    { icon: "icon-folder-plus", tip: "items.tool.newFolder", command: newGroup },
    { icon: "icon-unexpand", tip: "items.tool.unexpandAll", command: unExpandAll },
    { icon: "icon-expand", tip: "items.tool.expandAll", command: expandAll },
]);
</script>

<style lang="scss" scoped>
.panel {
    display: flex;
    flex-direction: row;
    flex: 0;
}

.svg {
    width: 16px;
    height: 16px;
    margin-left: 12px;
    padding: 6px;
}

.svg:hover {
    background-color: var(--hover-background-color);
}
</style>