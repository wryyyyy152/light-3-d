<template>
    <label v-i18n="{ i18nKey: props.group.display }"></label>
    <select class="select" @change="handleChange($event)">
        <template v-for="op in options">
            <option :value="op.textContent" :selected="op.selected"></option>
        </template>
    </select>
</template>

<script setup lang="ts">
import type { ICommand, Property } from 'light-core';
import { Combobox, I18n } from 'light-core';
import { ref } from 'vue';

const props = defineProps<{
    command: ICommand,
    group: Property,
}>();

const noType = props.command as any;
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

<style lang="scss" scoped>
.select {
    margin-left: 8px;
    padding: 2px 12px;
    font-size: 1em;
    border-radius: 6px;
    color: var(--foreground-color);
    border: 1px solid var(--border-color);
    background-color: var(--control-background-color);
}
</style>