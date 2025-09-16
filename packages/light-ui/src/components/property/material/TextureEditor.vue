<template>
    <div class="rootPanel root">
        <div class="headerPanel">
            <SvgIcon class="expanderIcon" :icon-name="getExpanderIcon()" @click="_handleExpanderClick($event)">
            </SvgIcon>
            <label class="headerText" v-i18n="{ i18nKey: props.header }"></label>
        </div>
        <div class="contextPanel" :class="{ 'hidden': !_isExpanded }">
            <template v-for="(control) in controls" :key="index">
                <component :is="control.component" v-bind="control.props" />
            </template>
        </div>
        <div class="expander">
            <div class="properties">
                <template v-for="(pro) in properties" :key="index">
                    <component :is="pro.component" v-bind="pro.props" />
                </template>
            </div>
            <div class="image">
                <img :style="{
                    backgroundImage: getBackgroundImage(props.texture.image),
                    backgroundSize: 'contain',
                }" @click="selectTexture()">
                <SvgIcon icon-name="icon-times" @click="props.texture.image = ''"></SvgIcon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UrlStringConverter } from 'light-controls';
import type { I18nKeys, IDocument, Texture } from 'light-core';
import { Property, readFileAsync } from 'light-core';
import { defineExpose, ref } from 'vue';
import SvgIcon from '../../common/SvgIcon.vue';
import { type controlType } from '../../utils';
import { findPropertyControl } from '../utils';

const props = defineProps<{
    header: I18nKeys,
    document: IDocument,
    display: I18nKeys,
    texture: Texture,
}>();

const _isExpanded = ref<boolean>(true)

const getExpanderIcon = () => {
    return _isExpanded.value ? "icon-angle-down" : "icon-angle-right";
}

const _handleExpanderClick = (e: MouseEvent) => {
    e.stopPropagation();
    _isExpanded.value = !_isExpanded.value;
};

const controls = ref<Array<controlType>>([])
const addItem = (con: controlType[]) => {
    controls.value.push(...con)
}

const properties = Property.getProperties(props.texture)
    .filter((x) => (x.name as keyof Texture) !== "image")
    .map((x) => findPropertyControl(props.document, [props.texture], x)).filter(x => x !== undefined);

const selectTexture = async () => {
    let file = await readFileAsync(".png, .jpg, .jpeg", false, "readAsDataURL");
    props.texture.image = file.value[0].data;
};
const getBackgroundImage = (v: any): string => {
    return new UrlStringConverter().convert(v).value || ''
}
defineExpose({
    addItem
})
</script>

<style lang="css" scoped>
.root {
    margin-top: 8px;
}

.expander {
    display: flex;
    flex-direction: row;
}

.properties {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.image {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4px;
    border-radius: 8px;
    position: relative;
    margin-left: 16px;

    &:hover {
        --delete-visiblity: visible;
    }

    img {
        width: 96px;
        height: 96px;
        border-radius: 4px;
    }

    svg {
        position: absolute;
        background-color: rgba(255, 0, 0, 0.45);
        border-radius: 50%;
        padding: 4px;
        top: 2px;
        right: 2px;
        width: 16px;
        height: 16px;
        visibility: var(--delete-visiblity);
    }
}
</style>