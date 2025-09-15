<template>
    <div class="panel">
        <span class="propertyName" v-i18n="{ i18nKey: props.property.display }"></span>
        <input class="box" :value="inputValue(props.objects[0])" :readonly="isReadOnly()"
            @keydown="handleKeyDown($event)" @blur="handleBlur($event)">
    </div>
</template>

<script setup lang="ts">
import {
    NumberConverter,
    StringConverter,
    XYConverter,
    XYZConverter,
} from "light-controls";
import type { IConverter, IDocument, Property } from 'light-core';
import { isPropertyChanged, PubSub, Transaction, XY, XYZ } from 'light-core';
import { ArrayValueConverter } from './utils';

const props = defineProps<{
    document: IDocument,
    objects: any[],
    property: Property,
    converter?: IConverter,
}>();

const getConverter = (): IConverter | undefined => {
    const name = props.objects[0][props.property.name].constructor.name;
    const converters: { [key: string]: () => IConverter } = {
        [XYZ.name]: () => new XYZConverter(),
        [XY.name]: () => new XYConverter(),
        [String.name]: () => new StringConverter(),
        [Number.name]: () => new NumberConverter(),
    };
    return converters[name]?.();
}

const arrayConverter = new ArrayValueConverter(props.objects, props.property, props.converter);
const converter = getConverter()

const inputValue = (object: any) => {
    const converted = arrayConverter.convert(object[props.property.name])
    if (converted.isOk) return converted.value
    else return object[props.property.name]
}

const isReadOnly = (): boolean => {
    let des = Object.getOwnPropertyDescriptor(props.objects[0], props.property.name);
    if (!des) {
        let proto = Object.getPrototypeOf(props.objects[0]);
        while (isPropertyChanged(proto)) {
            des = Object.getOwnPropertyDescriptor(proto, props.property.name);
            if (des) break;
            proto = Object.getPrototypeOf(proto);
        }
    }
    return (
        des?.set === undefined ||
        (props.converter === undefined && typeof props.objects[0][props.property.name] !== "string")
    );
}

const handleBlur = (e: FocusEvent) => {
    setValue(e.target as HTMLInputElement);
};

const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (converter && e.key === "Enter") {
        setValue(e.target as HTMLInputElement);
    }
};

const setValue = (input: HTMLInputElement) => {
    if (isReadOnly()) return;

    const newValue = converter?.convertBack?.(input.value);
    if (!newValue?.isOk) {
        PubSub.default.pub("showToast", "error.default:{0}", newValue?.error);
        return;
    }
    Transaction.execute(props.document, "modify property", () => {
        props.objects.forEach((x) => {
            x[props.property.name] = newValue.value;
        });
        props.document.visual.update();
    });
};
</script>

<style lang="scss" scoped></style>