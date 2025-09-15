<template>
    <div>
        <label v-i18n="{ i18nKey: props.group.display }"></label>
        <input type="checkbox" @click="handleClick()" :checked="checked">
    </div>
</template>

<script setup lang="ts">
import type { ICommand, Property } from 'light-core';
import { computed } from 'vue';

const props = defineProps<{
    command: ICommand,
    group: Property,
}>();

const checked = computed(() => {
    const noType1 = props.command as any;
    return noType1[props.group.name]
})

const noType = props.command as any;
const handleClick = () => {
    noType[props.group.name] = !noType[props.group.name];
}
</script>

<style lang="scss" scoped></style>