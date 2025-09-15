<template>
    <div class="panel" :class="selectedStyle">
        <label class="name">{{ props.node.name }}</label>
        <SvgIcon ref="svgRef" class="icon" :icon-name="getVisibleIcon()" @click="onVisibleIconClick($event)"> </SvgIcon>
    </div>
</template>

<script setup lang="ts">
import type { IDocument, INode } from 'light-core';
import { Transaction } from 'light-core';
import { defineExpose, onMounted, onUnmounted, ref } from 'vue';
import SvgIcon from '../../common/SvgIcon.vue';

const props = defineProps<{
    document: IDocument,
    node: INode
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

onMounted(() => {
    setVisibleStyle(props.node.parentVisible)
    props.node.onPropertyChanged(onPropertyChanged);
})

onUnmounted(() => {
    props.node.removePropertyChanged(onPropertyChanged);
})

const selectedStyle = ref<string>('')
const addSelectedStyle = () => {
    selectedStyle.value = 'current'
}

const removeSelectedStyle = () => {
    selectedStyle.value = ''
}

defineExpose({
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

.panel {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 2px;
    padding: 4px;
}

.panel:hover {
    background-color: var(--hover-background-color);
}

.current {
    outline: 2px solid var(--primary-color);
}
</style>