<template>
    <div :class="style.panel" ref="panelRef">
        <template v-if="rootNode">
            <TreeItem :document="document" :node="rootNode" />
        </template>
    </div>
</template>

<script setup lang="ts">
import type { IDocument, INodeChangedObserver, NodeRecord } from 'light-core';
import { INode, PubSub } from 'light-core';
import { computed, nextTick, onMounted, onUnmounted, provide, ref } from 'vue';
import style from '../../../styles/tree.module.css';
import TreeItem from './TreeItem.vue';

const props = defineProps<{
    document: IDocument
}>();

// 获取根节点
const rootNode = computed<INode | null>(() => {
    return props.document.rootNode || null;
});

const selectedNodes: Set<INode> = new Set();
let lastClicked: INode | undefined = undefined;

const treeForNodeChanged: INodeChangedObserver = {
    handleNodeChanged(records: NodeRecord[]) {
        records.forEach((record) => {
            if (record.oldParent)
                PubSub.default.pub('updateChildTreeItem', record.oldParent)

            if (record.newParent)
                PubSub.default.pub('updateChildTreeItem', record.newParent)
        })
    }
}

const panelRef = ref()
onMounted(() => {
    nextTick(() => {
        addEvents(panelRef.value)
    })

    props.document.addNodeObserver(treeForNodeChanged);
    PubSub.default.sub("selectionChanged", handleSelectionChanged);
})

onUnmounted(() => {
    props.document.removeNodeObserver(treeForNodeChanged);
    PubSub.default.remove("selectionChanged", handleSelectionChanged);
})

const handleSelectionChanged = (
    document: IDocument,
    selected: INode[],
    unselected: INode[],
) => {
    unselected.forEach((x) => {
        PubSub.default.pub("setTreeItemSelected", x, false);
        selectedNodes.delete(x);
    });
    setLastClickItem(undefined);
    selected.forEach((model) => {
        selectedNodes.add(model);
        PubSub.default.pub("setTreeItemSelected", model, true);
    });
    scrollToNode(selected);
};

const scrollToNode = (selected: INode[]) => {
    const node = selected.at(0);
    if (node) {
        expandParents(node);
        PubSub.default.pub("scrollToNode", node);
    }
}

const expandParents = (node: INode) => {
    let parent = node.parent;

    while (parent) {
        PubSub.default.pub("setTreeItemExpanded", node, true);
        parent = parent.parent;
    }
}

const addEvents = (item: HTMLElement) => {
    item.addEventListener("dragstart", onDragStart);
    item.addEventListener("dragover", onDragOver);
    item.addEventListener("dragleave", onDragLeave);
    item.addEventListener("drop", onDrop);
}

const onDragLeave = (event: DragEvent) => {
    // if (!this.canDrop(event)) return;
};

const onDragOver = (event: DragEvent) => {
    // if (!this.canDrop(event)) {
    //     return;
    // }
    // event.preventDefault();
    // event.dataTransfer!.dropEffect = "move";
};

const onDragStart = (event: DragEvent) => {
    event.stopPropagation();
    // const item = this.getTreeItem(event.target as HTMLElement)?.node;
    // this.dragging = INode.findTopLevelNodes(this.selectedNodes);
    // if (item && !INode.containsDescendant(this.selectedNodes, item)) {
    //     this.dragging.push(item);
    // }
};

const canDrop = (event: DragEvent) => {
    // let node = this.getTreeItem(event.target as HTMLElement)?.node;
    // if (node === undefined) return false;
    // if (this.dragging?.includes(node)) return false;
    // let parent = node.parent;
    // while (parent !== undefined) {
    //     if (this.dragging?.includes(parent)) return false;
    //     parent = parent.parent;
    // }
    // return true;
}

const onDrop = (event: DragEvent) => {
    // event.preventDefault();
    // event.stopPropagation();

    // let node = this.getTreeItem(event.target as HTMLElement)?.node;
    // if (node === undefined) return;
    // Transaction.execute(this.document, "move node", () => {
    //     let isLinkList = INode.isLinkedListNode(node);
    //     let newParent = isLinkList ? (node as INodeLinkedList) : node.parent;
    //     let target = isLinkList ? undefined : node;
    //     this.dragging?.forEach((x) => {
    //         x.parent?.move(x, newParent!, target);
    //     });
    //     this.dragging = undefined;
    // });
};

const setLastClickItem = (item: INode | undefined): void => {
    // if (lastClicked !== undefined) {
    //     nodeMap.get(lastClicked)?.removeSelectedStyle();
    // }
    // lastClicked = item;
    // if (item !== undefined) {
    //     nodeMap.get(item)?.addSelectedStyle();
    //     props.document.currentNode = INode.isLinkedListNode(item) ? item : item.parent;
    // }
}

const handleShiftClick = (item: INode) => {
    if (lastClicked) {
        const nodes = INode.getNodesBetween(lastClicked, item);
        props.document.selection.setSelection(nodes, false);
    }
}

provide('setLastClickItem', setLastClickItem)
provide('handleShiftClick', handleShiftClick)
</script>