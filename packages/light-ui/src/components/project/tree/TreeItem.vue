<template>
    <component :is="current.component" :document="props.document" :node="current.node" ref="realRef">
        <!-- 递归渲染子节点 -->
        <template v-if="hasChildren">
            <tree-item v-for="child in children" :key="child.id" :document="document"
                :node="child" />
        </template>
    </component>
</template>

<script setup lang="ts">
import type { IDocument, INodeLinkedList } from 'light-core';
import { INode, PubSub, ShapeType, VisualNode } from 'light-core';
import { NodeSelectionHandler, ShapeSelectionHandler } from 'light-vis';
import { computed, inject, onMounted, onUnmounted, ref, toRaw } from 'vue';
import TreeGroup from './TreeGroup.vue';
import type TreeItem from './TreeItem.vue';
import TreeModel from './TreeModel.vue';

const props = defineProps<{
    document: IDocument;
    node: INode;
}>();

// node链表中的节点发生改变时，手动触发计算属性重新计算
const refreshTrigger = ref<boolean>(false)
const forceRefershComputed = () => {
    refreshTrigger.value = !refreshTrigger.value
}

const current = computed(() => {
    refreshTrigger.value

    if (INode.isLinkedListNode(props.node)) {
        return { component: TreeGroup, node: props.node as INodeLinkedList };
    } else if (props.node instanceof VisualNode) {
        return { component: TreeModel, node: props.node as INode };
    } else {
        throw new Error(`Unknown node type: ${props.node.constructor.name}`);
    }
});

// 获取子节点列表
const children = computed<INode[]>(() => {
    const childNodes: INode[] = [];

    if (INode.isLinkedListNode(props.node)) {
        let currentChild = props.node.firstChild;
        while (currentChild) {
            childNodes.push(currentChild);
            currentChild = currentChild.nextSibling;
        }
    }

    return childNodes;
});

// 是否有子节点
const hasChildren = computed(() => {
    return children.value.length > 0;
});

const realRef = ref<InstanceType<typeof TreeGroup | typeof TreeModel>>()
const handleSetTreeItemSelected = (node: INode, selected: boolean) => {
    if (node !== props.node) return
    selected ? realRef.value?.addSelectedStyle() : realRef.value?.removeSelectedStyle()
}

// 定义“Group 实例”或“TreeModel 实例”的联合类型
type GroupOrTreeModelInstance =
    | InstanceType<typeof TreeGroup>
    | InstanceType<typeof TreeModel>;
// 类型守卫：判断实例是否为 TreeGroup 组件
const isTreeGroup = (
    instance: GroupOrTreeModelInstance | null
): instance is InstanceType<typeof TreeGroup> => {
    // 核心：通过组件的 $options 与目标组件比对
    return instance?.$options === TreeGroup;
};

const setExpanded = (node: INode, v: boolean) => {
    if (node !== props.node) return

    const instance = realRef.value;
    if (!instance) return
    if (isTreeGroup(instance)) {
        instance.setExpanded(v)
    }
}

const setLastClickItem = inject<(item: INode | undefined) => void>('setLastClickItem')
const handleShiftClick = inject<(item: INode) => void>('handleShiftClick')

const handleNodeClick = (event: MouseEvent) => {
    if (!canSelect()) return;
    event.stopPropagation();

    const _node = toRaw(props.node)
    if (event.shiftKey) {
        if (handleShiftClick)
            handleShiftClick(_node);
    } else {
        props.document.selection.setSelection([_node], event.ctrlKey);
    }

    if (!setLastClickItem) return
    setLastClickItem(_node);
};

const canSelect = () => {
    if (props.document.visual.eventHandler instanceof NodeSelectionHandler) {
        return true;
    }

    if (props.document.visual.eventHandler instanceof ShapeSelectionHandler) {
        return props.document.visual.eventHandler.shapeType === ShapeType.Shape;
    }

    return false;
}

onMounted(() => {
    realRef.value?.$el.addEventListener('click', handleNodeClick)

    PubSub.default.sub('updateChildTreeItem', handleUpdateChildTreeItem)
    PubSub.default.sub('setTreeItemSelected', handleSetTreeItemSelected)
    PubSub.default.sub("scrollToNode", handleScrollToNode);
    PubSub.default.sub("setTreeItemExpanded", setExpanded);
})

onUnmounted(() => {
    PubSub.default.remove('updateChildTreeItem', handleUpdateChildTreeItem)
    PubSub.default.remove('setTreeItemSelected', handleSetTreeItemSelected)
    PubSub.default.remove("scrollToNode", handleScrollToNode);
    PubSub.default.remove("setTreeItemExpanded", setExpanded);
})

const handleUpdateChildTreeItem = (node: INode) => {
    if (node !== props.node) return
    forceRefershComputed()
}

const handleScrollToNode = (node: INode) => {
    if (node !== props.node) return
    realRef.value?.$el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
</script>