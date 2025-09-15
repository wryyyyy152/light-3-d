<template>
    <div class="root" :style="{ cursor }">
        <viewport v-if="activeViewportPorp" class="viewport" :view="activeViewportPorp.view"
            :show-view-controls="activeViewportPorp.showViewControls">
        </viewport>
    </div>
</template>

<script setup lang="ts">
import type { CollectionChangedArgs, CursorType, IApplication, IView } from 'light-core';
import { CollectionAction, PubSub } from 'light-core';
import { onMounted, onUnmounted, ref, withDefaults } from 'vue';
import { Cursor, } from '../cursor';
// import Viewport from './Viewport.vue';

const props = withDefaults(defineProps<{
    app: IApplication;
    showViewControls?: boolean;
}>(), {
    showViewControls: () => true
});
const init = () => {
    props.app.views.onCollectionChanged(_handleViewCollectionChanged);
}

interface viewportPorpType { view: IView, showViewControls: boolean }
let viewportPorpMap: Map<IView, viewportPorpType> = new Map()
const activeViewportPorp = ref<viewportPorpType>()
const _handleViewCollectionChanged = (args: CollectionChangedArgs) => {
    if (args.action === CollectionAction.add) {
        args.items.forEach((view) => {
            viewportPorpMap.set(view, { view: view as IView, showViewControls: props.showViewControls })
        });
    } else if (args.action === CollectionAction.remove) {
        args.items.forEach((view) => {
            viewportPorpMap.delete(view)
        });
    }
};

onMounted(() => {
    PubSub.default.sub("activeViewChanged", _handleActiveViewChanged);
    PubSub.default.sub("viewCursor", _handleCursor);
})

onUnmounted(() => {
    PubSub.default.remove("activeViewChanged", _handleActiveViewChanged);
    PubSub.default.remove("viewCursor", _handleCursor);
})

const cursor = ref()
const _handleCursor = (type: CursorType) => {
    cursor.value = Cursor.get(type);
};

const _handleActiveViewChanged = (view: IView | undefined) => {
    if (!view) return
    activeViewportPorp.value = viewportPorpMap.get(view)
};

init()
</script>

<style lang="scss" scoped></style>