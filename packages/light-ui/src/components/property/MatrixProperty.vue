<template>
    <div :class="style.panel">
        <InputProperty :document="props.document" :objects="[first]" :property="{
            name: 'transform',
            display: 'transform.translation',
        }" :converter="translationConverter"></InputProperty>
        <InputProperty :document="props.document" :objects="[first]" :property="{
            name: 'transform',
            display: 'transform.scale',
        }" :converter="scalingConverter"></InputProperty>
        <InputProperty :document="props.document" :objects="[first]" :property="{
            name: 'transform',
            display: 'transform.rotation',
        }" :converter="rotateConverter"></InputProperty>
    </div>
</template>

<script setup lang="ts">
import type { GroupNode, IDocument, VisualNode } from 'light-core';
import { onMounted, onUnmounted } from 'vue';
import style from '../../styles/propertyBase.module.css';
import InputProperty from './InputProperty.vue';
import { RotateConverter, ScalingConverter, TranslationConverter } from './utils';

const props = defineProps<{
    document: IDocument,
    geometries: (VisualNode | GroupNode)[],
}>();

const first: VisualNode | GroupNode = props.geometries[0]

const translationConverter = new TranslationConverter(first)
const scalingConverter = new ScalingConverter(first)
const rotateConverter = new RotateConverter(first)

onMounted(() => {
    (first as VisualNode).onPropertyChanged(onPropertyChanged);
})

onUnmounted(() => {
    (first as VisualNode).removePropertyChanged(onPropertyChanged);
})

const onPropertyChanged = (property: keyof (VisualNode | GroupNode)) => {
    if (property === "transform") {
        props.geometries.forEach((obj) => {
            if (obj === first) return;
            obj.transform = first.transform;
        });
    }
};
</script>