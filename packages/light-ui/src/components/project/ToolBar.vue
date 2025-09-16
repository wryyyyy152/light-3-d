<template>
    <div :class="style.panel">
        <a v-for="b in buttons" :title="I18n.translate(b.tip)">
            <SvgIcon :icon-name="b.icon" :class="style.svg" @click="b.command"></SvgIcon>
        </a>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys, IDocument } from 'light-core';
import { I18n, INode, PubSub } from 'light-core';
import { inject, ref } from 'vue';
import style from '../../styles/toolBar.module.css';
import SvgIcon from '../common/SvgIcon.vue';
import type TreeItem from './TreeItem.vue';

const props = defineProps<{
    document: IDocument | undefined
}>();

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

const setExpand = (expand: boolean) => {
    let first = props.document?.rootNode.firstChild;
    if (first) setNodeExpand(first, expand);
}

const getTreeItem = inject<(node: INode) => InstanceType<typeof TreeItem> | undefined>('getTreeItem')
const setNodeExpand = (list: INode, expand: boolean) => {
    if (!getTreeItem) return
    let item = getTreeItem(list);
    item.setExpanded(expand)

    if (INode.isLinkedListNode(list) && list.firstChild) {
        setNodeExpand(list.firstChild, expand);
    }
    if (list.nextSibling) {
        setNodeExpand(list.nextSibling, expand);
    }
}

const buttons = ref<button[]>([
    { icon: "icon-folder-plus", tip: "items.tool.newFolder", command: newGroup },
    { icon: "icon-unexpand", tip: "items.tool.unexpandAll", command: unExpandAll },
    { icon: "icon-expand", tip: "items.tool.expandAll", command: expandAll },
]);
</script>