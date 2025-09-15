<template>
    <div class="root">
        <div class="title">
            <span v-i18n="{ i18nKey: 'common.material' }"></span>
            <SvgIcon icon-name="icon-plus" @click="props.dataContent.addMaterial()"></SvgIcon>
            <SvgIcon icon-name="icon-clone" @click="props.dataContent.copyMaterial()"></SvgIcon>
            <SvgIcon icon-name="icon-trash" @click="props.dataContent.deleteMaterial()"></SvgIcon>
        </div>
        <div class="materials">
            <template v-for="material in dataContent.document.materials">
                <span :class="getActiveCalss(material, props.dataContent.editingMaterial)" :style="{
                    backgroundColor: getBackgroundColor(material.color),
                    backgroundImage: getBackgroundImage(material.map.image),
                    backgroundBlendMode: 'multiply',
                    backgroundSize: 'contain',
                }" @click="handelClick(material)" @dblclick="handelDbClick(material)">
                    {{ material.name }}
                </span>
            </template>
        </div>
        <div class="properties">
            <template v-for="(control) in editingControls" :key="index">
                <component :is="control.component" v-bind="control.props" />
            </template>
        </div>
        <div class="bottom">
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
import SvgIcon from '../../common/SvgIcon.vue';
import { type controlType } from '../../utils';
import { findPropertyControl } from '../utils';
import type { MaterialDataContent } from './materialDataContent';

const props = defineProps<{
    dataContent: MaterialDataContent
}>();

const getActiveCalss = (material: Material, convertMaterial: Material) => {
    material === convertMaterial ? `material active` : 'material'
}
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

<style lang="scss" scoped>
.root {
    display: flex;
    flex-direction: column;
    position: absolute;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-color: var(--background-color);
    top: 16px;
    left: 16px;
    padding: 16px;
    max-width: 480px;
    max-height: 75%;
    overflow: hidden;
    z-index: 99999;
}

.title {
    margin: 0px 6px;
    display: flex;
    flex: 0;
    flex-direction: row;
    align-items: center;

    span {
        font-size: medium;
        flex: 1;
    }

    svg {
        width: 16px;
        height: 16px;
        padding: 6px;
        margin: 0 3px;

        &:hover {
            background-color: var(--hover-background-color);
        }
    }
}

.materials {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-radius: 8px;
    background-color: var(--panel-background-color);
    border: 1px solid var(--border-color);
    margin: 8px 0px;
    padding: 4px;
    min-height: 60px;
    max-height: 120px;
    flex: 0;
    overflow: hidden;
    overflow-y: auto;
}

.material {
    border-radius: 8px;
    width: 48px;
    height: 48px;
    border: 1px solid gray;
    margin: 4px;
}

.active {
    border: 5px solid var(--primary-color);
}

.properties {
    display: flex;
    flex: 1;
    flex-direction: column;
    border-radius: 8px;
    background-color: var(--panel-background-color);
    border: 1px solid var(--border-color);
    padding: 16px;
    --delete-visiblity: hidden;
    overflow: hidden;
    overflow-y: auto;
}

.bottom {
    display: flex;
    flex-direction: row;
    margin-top: 8px;

    button {
        width: 96px;
        height: 28px;
        margin-right: 8px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        background-color: var(--panel-background-color);

        &:hover {
            background-color: var(--hover-background-color);
        }
    }
}
</style>