<template>
    <div :class="style.root" :style="{ cursor }">
        <viewport v-if="activeViewport" :class="style.viewport" :view="activeViewport"
            :show-view-controls="props.showViewControls">
        </viewport>
    </div>
</template>

<script setup lang="ts">
import type { CollectionChangedArgs, CursorType, IApplication, IView } from 'light-core';
import { CollectionAction, PubSub } from 'light-core';
import { onMounted, onUnmounted, ref, toRaw, withDefaults } from 'vue';
import style from '../../styles/layoutViewport.module.css';
import { Cursor, } from '../cursor';
import Viewport from './Viewport.vue';

const props = withDefaults(defineProps<{
    app: IApplication;
    showViewControls?: boolean;
}>(), {
    showViewControls: () => true
});

const activeViewport = ref<IView>()

const _handleViewCollectionChanged = (args: CollectionChangedArgs) => {
    const _activeViewport = toRaw(activeViewport.value)
    if (args.action === CollectionAction.remove && args.items.includes(_activeViewport)) {
        activeViewport.value = undefined
    }
};
props.app.views.onCollectionChanged(_handleViewCollectionChanged);

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
    activeViewport.value = view
};
</script>