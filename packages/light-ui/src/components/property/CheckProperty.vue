<template>
    <div class="panel"></div>
</template>

<script setup lang="ts">
import type { Property } from 'light-core';

const props = defineProps<{
    objects: any[],
    readonly property: Property,
}>();
</script>

<style lang="scss" scoped>
.panel {
    margin: 3px 0;
}
</style>