<template>
    <div class="container">
        <div class="row header" :class="{ 'hide': !_isExpanded, 'current': selectedStyle }">
            <SvgIcon :icon-name="getExpanderIcon()" class="expanderIcon" @click="handleExpanderClick($event)"></SvgIcon>
            <label class="name">{{ props.node.name }}</label>
            <SvgIcon ref="svgRef" class="icon" :icon-name="getVisibleIcon()" @click="onVisibleIconClick($event)">
            </SvgIcon>
        </div>
        <div class="container left16px">

        </div>
    </div>
</template>

<script setup lang="ts">
import type { IDocument, INode, INodeLinkedList } from 'light-core';
import { Transaction } from 'light-core';
import { defineExpose, onMounted, onUnmounted, ref } from 'vue';
import SvgIcon from '../../common/SvgIcon.vue';

const props = defineProps<{
    document: IDocument,
    node: INodeLinkedList
}>();

const getVisibleIcon = () => {
    return props.node.visible ? "icon-eye" : "icon-eye-slash";
}

const onVisibleIconClick = (e: MouseEvent) => {
    e.stopPropagation();
    Transaction.execute(props.document, "change visible", () => {
        props.node.visible = !props.node.visible;
    });
    props.document.visual.update();
}

const svgRef = ref<InstanceType<typeof SvgIcon> | undefined>(undefined)
const setVisibleStyle = (parentVisible?: boolean) => {
    if (parentVisible === true) {
        svgRef.value?.$el.classList.remove("parent-hidden");
    } else {
        svgRef.value?.$el.classList.add("parent-hidden");
    }
}

const onPropertyChanged = (property: keyof INode, model: INode) => {
    if (property === "parentVisible") {
        setVisibleStyle(model[property]);
    }
};

const _isExpanded = ref(true);

const setExpanded = (v: boolean) => {
    _isExpanded.value = v
}

const getExpanderIcon = () => {
    return _isExpanded.value ? "icon-angle-down" : "icon-angle-right";
}

const handleExpanderClick = (e: MouseEvent) => {
    e.stopPropagation();
    _isExpanded.value = !_isExpanded.value;
};

onMounted(() => {
    setVisibleStyle(props.node.parentVisible)
    props.node.onPropertyChanged(onPropertyChanged);
})

onUnmounted(() => {
    props.node.removePropertyChanged(onPropertyChanged);
})

const selectedStyle = ref<boolean>(false)
const addSelectedStyle = () => {
    selectedStyle.value = true
}

const removeSelectedStyle = () => {
    selectedStyle.value = false
}

defineExpose({
    setExpanded,
    addSelectedStyle,
    removeSelectedStyle
})
</script>

<style lang="scss" scoped>
.name {
    flex: 1 1 auto;
    font-size: 12px;
    user-select: none;
    text-wrap: nowrap;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    overflow: hidden;
}

.icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    padding: 0px 8px;
}

.parent-hidden {
    opacity: 0.56;
}

.expanderIcon {
    width: 12px;
    height: 12px;
    padding: 2px 4px;
}

.left16px {
    padding-left: 16px;
}

.container {
    display: flex;
    flex-direction: column;
}

.hide {
    display: none;
}

.header {
    padding: 4px;
    border-radius: 2px;
}

.header:hover {
    background-color: var(--hover-background-color);
}

.row {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.current {
    outline: 2px solid var(--primary-color);
}
</style>