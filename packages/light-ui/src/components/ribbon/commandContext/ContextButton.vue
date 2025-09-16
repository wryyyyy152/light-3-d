<template>
    <button v-i18n="{ i18nKey: props.group.display }" @click="handleClick()"></button>
</template>

<script setup lang="ts">
import type { ICommand, Property } from 'light-core';
import { toRaw } from 'vue';

const props = defineProps<{
    command: ICommand,
    group: Property,
}>();

const noType = toRaw(props.command) as any;
const handleClick=()=>{
    noType[props.group.name]()
}
</script>