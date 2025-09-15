<template>
    <button v-i18n="{ i18nKey: props.group.display }" @click="handleClick()"></button>
</template>

<script setup lang="ts">
import type { ICommand, Property } from 'light-core';

const props = defineProps<{
    command: ICommand,
    group: Property,
}>();

const noType = props.command as any;
const handleClick=()=>{
    noType[props.group.name]()
}
</script>

<style lang="scss" scoped>

</style>