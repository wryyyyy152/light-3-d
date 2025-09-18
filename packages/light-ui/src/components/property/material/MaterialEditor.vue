<template>
    <div :class="style.root">
        <div :class="style.title">
            <span v-i18n="{ i18nKey: 'common.material' }"></span>
            <SvgIcon icon-name="icon-plus" @click="props.dataContent.addMaterial()"></SvgIcon>
            <SvgIcon icon-name="icon-clone" @click="props.dataContent.copyMaterial()"></SvgIcon>
            <SvgIcon icon-name="icon-trash" @click="props.dataContent.deleteMaterial()"></SvgIcon>
        </div>
        <div :class="style.materials">
            <template v-for="material in dataContent.document.materials">
                <span :class="{ [style.material]: true, [style.active]: material === props.dataContent.editingMaterial }"
                    :style="{
                        backgroundColor: getBackgroundColor(material.color),
                        backgroundImage: getBackgroundImage(material.map.image),
                        backgroundBlendMode: 'multiply',
                        backgroundSize: 'contain',
                    }" @click="handelClick(material)" @dblclick="handelDbClick(material)">
                    {{ material.name }}
                </span>
            </template>
        </div>
        <div :class="style.properties">
            <template v-for="(control) in editingControls" :key="index">
                <component :is="control.component" v-bind="control.props" />
            </template>
        </div>
        <div :class="style.bottom">
            <button v-i18n="{ i18nKey: 'common.confirm' }" @click="handleConfirm()"></button>
            <button v-i18n="{ i18nKey: 'common.cancel' }" @click="handleCancel()"></button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ColorConverter, UrlStringConverter, } from 'light-controls';
import type { Material } from 'light-core';
import { Property, PubSub, Texture } from 'light-core';
import { onMounted, onUnmounted, ref } from 'vue';
import style from '../../../styles/materialEditor.module.css';
import SvgIcon from '../../common/SvgIcon.vue';
import { type controlType } from '../../utils';
import { findPropertyControl } from '../utils';
import type { MaterialDataContent } from './materialDataContent';

const props = defineProps<{
    dataContent: MaterialDataContent
}>();

const getBackgroundColor = (v: any): string => {
    return new ColorConverter().convert(v).value || ''
}
const getBackgroundImage = (v: any): string => {
    return new UrlStringConverter().convert(v).value || ''
}

const handelClick = (material: Material) => {
    props.dataContent.editingMaterial = material;
}

const handelDbClick = (material: Material) => {
    props.dataContent.callback(material);
    // todo
}

const editingControls = ref<Array<controlType>>([])
const initEditingControl = (material: Material) => {
    editingControls.value.length = 0;

    const isTexture = (p: Property) => {
        return (material as any)[p.name] instanceof Texture;
    };

    let properties = Property.getProperties(material);
    editingControls.value.push(
        ...properties
            .filter((x: any) => !isTexture(x))
            .map((x: any) => findPropertyControl(props.dataContent.document, [material], x)).filter(x => x !== undefined),
        ...properties
            .filter(isTexture)
            .map((x: any) => findPropertyControl(props.dataContent.document, [material], x)).filter(x => x !== undefined),
    );
}
initEditingControl(props.dataContent.editingMaterial)

const handleConfirm = () => {
    // todo
}

const handleCancel = () => {
    // todo
}

onMounted(() => {
    props.dataContent.onPropertyChanged(_onEditingMaterialChanged);
    PubSub.default.sub("showProperties", _handleShowProperty);
})

onUnmounted(() => {
    PubSub.default.remove("showProperties", _handleShowProperty);
})

const _handleShowProperty = () => {
    // todo
};

const _onEditingMaterialChanged = (property: keyof MaterialDataContent) => {
    if (property !== "editingMaterial") return;
    editingControls.value.shift()
};
</script>