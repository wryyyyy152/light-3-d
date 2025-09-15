<template>
    <div class="panel" ref="panelRef">
        <template v-if="rootNode">
            <tree-item :document="document" :node="rootNode" :node-map="nodeMap" />
        </template>
    </div>
</template>

<script setup lang="ts">
import type { IDocument, INodeChangedObserver, NodeRecord } from 'light-core';
import { INode, PubSub } from 'light-core';
import { computed, defineExpose, onMounted, onUnmounted, ref } from 'vue';
import TreeItem from './TreeItem.vue';

const props = defineProps<{
    document: IDocument
}>();

// 获取根节点
const rootNode = computed<INode | null>(() => {
    return props.document.rootNode || null;
});

// 维护每个节点的组件实例，以便通过实例调用方法
const nodeMap: Map<INode, InstanceType<typeof TreeItem>> = new Map()
// 之后每个节点创建后，都把实例放到map里

const selectedNodes: Set<INode> = new Set();
let lastClicked: INode | undefined = undefined;

const treeForNodeChanged: INodeChangedObserver = {
    handleNodeChanged(records: NodeRecord[]) {
        records.forEach((record) => {
            // const componemt = nodeMap.get(record.node);
            // if (!componemt || !record.newParent) return;

            if (!record.newParent) return;

            let parent = nodeMap.get(record.newParent)

            if (parent) {
                parent.forceRefershComputed()
            }
        })
    }
}

const panelRef = ref()
onMounted(() => {
    addEvents(panelRef.value.$el)
    props.document.addNodeObserver(treeForNodeChanged);
    PubSub.default.sub("selectionChanged", handleSelectionChanged);
})

onUnmounted(() => {
    removeEvents(panelRef.value.$el)
    props.document.removeNodeObserver(treeForNodeChanged);
    PubSub.default.remove("selectionChanged", handleSelectionChanged);
})

const handleSelectionChanged = (
    document: IDocument,
    selected: INode[],
    unselected: INode[],
) => {
    unselected.forEach((x) => {
        nodeMap.get(x)?.removeSelectedStyle();
        selectedNodes.delete(x);
    });
    setLastClickItem(undefined);
    selected.forEach((model) => {
        selectedNodes.add(model);
        nodeMap.get(model)?.addSelectedStyle();
    });
    scrollToNode(selected);
};

const setLastClickItem = (item: INode | undefined) => {
    if (lastClicked !== undefined) {
        nodeMap.get(lastClicked)?.removeSelectedStyle();
    }
    lastClicked = item;
    if (item !== undefined) {
        nodeMap.get(item)?.addSelectedStyle();
        props.document.currentNode = INode.isLinkedListNode(item) ? item : item.parent;
    }
}

const scrollToNode = (selected: INode[]) => {
    const node = selected.at(0);
    if (node) {
        expandParents(node);
        nodeMap.get(node)?.$el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
}

const expandParents = (node: INode) => {
    let parent = node.parent;

    while (parent) {
        const group = nodeMap.get(parent);
        if (group) {
            group.setExpanded(true);
        }
        parent = parent.parent;
    }
}

defineExpose({

})

const addEvents = (item: HTMLElement) => {
    item.addEventListener("dragstart", onDragStart);
    item.addEventListener("dragover", onDragOver);
    item.addEventListener("dragleave", onDragLeave);
    item.addEventListener("drop", onDrop);
    item.addEventListener("click", onClick);
}

const removeEvents = (item: HTMLElement) => {
    item.removeEventListener("dragstart", onDragStart);
    item.removeEventListener("dragover", onDragOver);
    item.removeEventListener("dragleave", onDragLeave);
    item.removeEventListener("drop", onDrop);
    item.removeEventListener("click", onClick);
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

const onClick = (event: MouseEvent) => {
    // if (!this.canSelect()) return;

    // const item = this.getTreeItem(event.target as HTMLElement)?.node;
    // if (!item) return;
    // event.stopPropagation();

    // if (event.shiftKey) {
    //     this.handleShiftClick(item);
    // } else {
    //     this.document.selection.setSelection([item], event.ctrlKey);
    // }

    // this.setLastClickItem(item);
};
</script>

<style lang="scss" scoped>
.panel {
    margin: 4px;
}

.selected {
    background-color: var(--hover-background-color);
}

.current {
    outline: 2px solid var(--primary-color);
}

.dragging {
    opacity: 0.56;
    pointer-events: none;
}
</style>