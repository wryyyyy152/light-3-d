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
const oriItems: Collection<T> = new Collection(...props.sources.items)
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
            oriItems.push(...args.items);
            break;
        case CollectionAction.remove:
            oriItems.remove(...args.items);
            break;
        case CollectionAction.move:
            oriItems.move(args.from, args.to);
            break;
        case CollectionAction.replace:
            oriItems.replace(args.index, ...args.items);
            oriItems.remove(args.item)
            break;
        default:
            throw new Error("Unknown collection action");
    }
    items.value.clear()
    items.value.push(...oriItems)
}
</script>