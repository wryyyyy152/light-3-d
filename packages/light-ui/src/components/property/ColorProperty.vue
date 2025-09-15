<template>
    <div class="panel">
        <label class="propertyName" v-i18n="{ i18nKey: props.property.display }"></label>
        <input type="color" class="color" @change="setColor($event)" :value="inputValue(props.objects[0])">
    </div>
</template>

<script setup lang="ts">
import { ColorConverter } from 'light-controls';
import type { IDocument, Property } from 'light-core';
import { PubSub, Transaction } from 'light-core';

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

<style lang="scss" scoped>
.panel {
    margin: 3px 0;
}
.color {
    width: 64px;
    height: 32px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
}
.panel {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}
.propertyName {
    font-size: 14px;
    opacity: 0.75;
    color: var(--color);
    min-width: 72px;
    flex: 0 1 auto;
}
</style>