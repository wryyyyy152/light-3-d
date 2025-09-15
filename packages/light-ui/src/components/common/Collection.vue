<template>
    <template v-for="it in items">
        <slot :item="it"></slot>
    </template>
</template>

<script setup lang="ts" generic="T">
import type { CollectionChangedArgs } from 'light-core';
import { Collection, CollectionAction, ObservableCollection } from "light-core";
import { onMounted, onUnmounted, ref } from 'vue';

// 2. 在 defineProps 中使用这个泛型类型
const props = defineProps<{
    sources: ObservableCollection<T>
}>();
const items = ref<Collection<T>>(new Collection(...props.sources.items))

onMounted(() => {
    props.sources.onCollectionChanged(_onCollectionChanged);
})

onUnmounted(() => {
    props.sources.removeCollectionChanged(_onCollectionChanged);
})

const _onCollectionChanged = (args: CollectionChangedArgs) => {
    switch (args.action) {
        case CollectionAction.add:
            items.value.push(...args.items);
            break;
        case CollectionAction.remove:
            items.value.remove(...args.items)
            break;
        case CollectionAction.move:
            items.value.move(args.from, args.to);
            break;
        case CollectionAction.replace:
            items.value.replace(args.index, ...args.items);
            items.value.remove(args.item)
            break;
        default:
            throw new Error("Unknown collection action");
    }
}
</script>

<style lang="scss" scoped></style>