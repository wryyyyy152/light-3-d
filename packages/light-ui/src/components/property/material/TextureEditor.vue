<template>
    <div :class="[style.rootPanel,style.root]">
        <div :class="style.headerPanel">
            <SvgIcon :class="style.expanderIcon" :icon-name="getExpanderIcon()" @click="_handleExpanderClick($event)">
            </SvgIcon>
            <label :class="style.headerText" v-i18n="{ i18nKey: props.header }"></label>
        </div>
        <div :class="{[style.contextPanel]:true, [style.hidden]: !_isExpanded }">
            <template v-for="(control) in controls" :key="index">
                <component :is="control.component" v-bind="control.props" />
            </template>
        </div>
        <div :class="style.expander">
            <div :class="style.properties">
                <template v-for="(pro) in properties" :key="index">
                    <component :is="pro.component" v-bind="pro.props" />
                </template>
            </div>
            <div :class="style.image">
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
import style from '../../../styles/textureEditor.module.css';
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