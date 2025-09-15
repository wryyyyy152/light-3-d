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

<style lang="scss" scoped></style>