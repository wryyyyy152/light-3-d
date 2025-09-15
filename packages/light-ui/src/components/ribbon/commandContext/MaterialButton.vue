<template>
    <button :style="{
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage,
        backgroundBlendMode: 'multiply',
        backgroundSize: 'cover',
        cursor: 'pointer', 
    }" v-i18n="{ i18nKey: props.group,display }" @click="handleClick()">
    </button>
</template>

<script setup lang="ts">
import { MultistepCommand } from "light";
import { ColorConverter, UrlStringConverter } from "light-controls";
import type { ICommand, Property } from 'light-core';
import { CancelableCommand, PubSub } from 'light-core';
import { ref } from "vue";

const props = defineProps<{
    command: ICommand,
    group: Property,
}>();

if (!(props.command instanceof CancelableCommand)) {
    throw new Error("MaterialEditor only support CancelableCommand");
}
const noType = props.command as any;
let material = props.command.document.materials.find((x) => x.id === noType[props.group.name])!;
let display = material.clone();

const colorConverterValue = new ColorConverter().convert(display.color).value || ''
const urlStringConverterValue = new UrlStringConverter().convert(display.map.image).value || ''
const backgroundColor = ref<string>(colorConverterValue)
const backgroundImage = ref<string>(urlStringConverterValue)

const handleClick = () => {
    if (props.command instanceof MultistepCommand) {
        PubSub.default.pub("editMaterial", props.command.document, material, (newMaterial) => {
            noType[props.group.name] = newMaterial.id;
            display.color = newMaterial.color;
            display.map = newMaterial.map;
        });
    }
}
</script>

<style lang="scss" scoped>

</style>