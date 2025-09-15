<template>
    <div>
        <label v-i18n="{ i18nKey: props.group.display }"></label>
        <input type="text" class="input" :value="value" @keydown="handleKeyDown($event)">
    </div>
</template>

<script setup lang="ts">
import type { ICommand, Property } from 'light-core';
import { computed } from 'vue';

const props = defineProps<{
    command: ICommand,
    group: Property,
    converter?: (v: string) => any
}>();

const value = computed(() => {
    const noType1 = props.command as any;
    return noType1[props.group.name]
})

const noType = props.command as any;
const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
        const input = e.target as HTMLInputElement;
        noType[props.group.name] = props.converter ? props.converter(input.value) : input.value;
        input.blur();
    }
}
</script>

<style lang="scss" scoped>
.input {
    margin-left: 8px;
}
</style>