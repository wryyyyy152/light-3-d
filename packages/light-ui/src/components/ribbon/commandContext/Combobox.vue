<template>
    <label v-i18n="{ i18nKey: props.group.display }"></label>
    <select :class="style.select" @change="handleChange($event)">
        <template v-for="op in options">
            <option :value="op.textContent" :selected="op.selected"></option>
        </template>
    </select>
</template>

<script setup lang="ts">
import type { ICommand, Property } from 'light-core';
import { Combobox, I18n } from 'light-core';
import { ref, toRaw } from 'vue';
import style from '../../../styles/commandContext.module.css';

const props = defineProps<{
    command: ICommand,
    group: Property,
}>();

const noType = toRaw(props.command) as any;
let combobox = noType[props.group.name] as Combobox<any>;
let options1 = combobox.items.map((item, index): { selected: boolean, textContent: string } => {
    return {
        selected: index === combobox.selectedIndex,
        textContent: I18n.isI18nKey(item)
            ? I18n.translate(item)
            : (combobox.converter?.convert(item).unchecked() ?? String(item)),
    };
});
const options = ref<Array<{ selected: boolean, textContent: string }>>(options1)

const handleChange = (e: Event) => {
    combobox.selectedIndex = (e.target as HTMLSelectElement).selectedIndex;
}
</script>