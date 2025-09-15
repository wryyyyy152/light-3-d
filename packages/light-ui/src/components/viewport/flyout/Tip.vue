<template>
    <div class="tip" :class="color">
        {{ props.msg }}
    </div>
</template>

<script setup lang="ts">
import { MessageType } from 'light-core';
import { computed } from 'vue';

const props = defineProps<{
    msg: string,
    type: MessageType
}>()

const color = computed(() => {
    switch (props.type) {
        case MessageType.error:
            return 'error';
        case MessageType.warn:
            return 'warn';
        default:
            return 'info';
    }
})
</script>

<style lang="scss" scoped>
.tip {
    font-size: 13px;
    background-color: var(--panel-background-color);
    opacity: 0.85;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 1px 4px;
    margin: 2px 0px;
}

.info {
    color: var(--foreground-color);
}

.warn {
    color: yellow;
}

.error {
    color: red;
}
</style>