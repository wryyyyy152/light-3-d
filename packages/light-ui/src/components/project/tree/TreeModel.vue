<template>
    <div :class="{[style.panel]:true,[style.current]:isCurrent}">
        <label :class="style.name">{{ props.node.name }}</label>
        <SvgIcon ref="svgRef" :class="style.icon" :icon-name="getVisibleIcon()" @click="onVisibleIconClick($event)"> </SvgIcon>
    </div>
</template>

<script setup lang="ts">
import type { IDocument, INode } from 'light-core';
import { Transaction } from 'light-core';
import { defineExpose, onMounted, onUnmounted, ref } from 'vue';
import style from '../../../styles/treeModel.module.css';
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

const isCurrent = ref<boolean>(false)
const addSelectedStyle = () => {
    isCurrent.value = true
}

const removeSelectedStyle = () => {
    isCurrent.value = false
}

defineExpose({
    addSelectedStyle,
    removeSelectedStyle
})
</script>