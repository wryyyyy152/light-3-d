<template>
    <div :class="style.panel">
        <label :class="style.propertyName" v-i18n="{ i18nKey: props.property.display }"></label>
        <input type="color" :class="style.color" @change="setColor($event)" :value="inputValue(props.objects[0])">
    </div>
</template>

<script setup lang="ts">
import { ColorConverter } from 'light-controls';
import type { IDocument, Property } from 'light-core';
import { PubSub, Transaction } from 'light-core';
import style from '../../styles/colorPorperty.module.css';

const props = defineProps<{
    document: IDocument,
    objects: any[],
    property: Property,
}>();

const converter = new ColorConverter();

const setColor = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    const color = converter.convertBack(value).value;
    if (color === undefined) {
        PubSub.default.pub("showToast", "toast.converter.invalidColor");
        return;
    }
    Transaction.execute(props.document, "change color", () => {
        props.objects.forEach((x) => {
            x[props.property.name] = color;
        });
    });
}

const inputValue = (object: any) => {
    const converted = converter.convert(object[props.property.name])
    if (converted.isOk) return converted.value
    else return object[props.property.name]
}
</script>