<template>
    <div :class="style.container">
        <div
            :class="{ [style.row]: true, [style.header]: true, [style.hide]: !_isExpanded, [style.current]: selectedStyle }">
            <SvgIcon :icon-name="getExpanderIcon()" :class="style.expanderIcon" @click="handleExpanderClick($event)"></SvgIcon>
            <label :class="style.name">{{ props.node.name }}</label>
            <SvgIcon ref="svgRef" :class="style.icon" :icon-name="getVisibleIcon()" @click="onVisibleIconClick($event)">
            </SvgIcon>
        </div>
        <div :class="{[style.container]:true, [style.left16px]:true}">

        </div>
    </div>
</template>

<script setup lang="ts">
import type { IDocument, INode, INodeLinkedList } from 'light-core';
import { Transaction } from 'light-core';
import { defineExpose, onMounted, onUnmounted, ref } from 'vue';
import style from '../../../styles/treeItemGroup.module.css';
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