<template>
    <div :class="style.panel"></div>
</template>

<script setup lang="ts">
import type { Property } from 'light-core';
import style from '../../styles/propertyBase.module.css';

const props = defineProps<{
    objects: any[],
    readonly property: Property,
}>();
</script>