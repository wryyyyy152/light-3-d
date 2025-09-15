<template>
    <div class="panel" :class="className">
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
import InputProperty from './InputProperty.vue';
import { RotateConverter, ScalingConverter, TranslationConverter } from './utils';

const props = defineProps<{
    document: IDocument,
    geometries: (VisualNode | GroupNode)[],
    className: string,
    objects: any[],
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
        props.objects.forEach((obj) => {
            if (obj === first) return;
            obj.transform = first.transform;
        });
    }
};
</script>

<style lang="scss" scoped>
.panel {
    margin: 3px 0;
}
</style>