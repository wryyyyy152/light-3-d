<template>
    <dialog ref="dialogRef">
        <div class="container">
            <div class="loading" :style="{ animation: `circle infinite 0.75s linear` }"></div>
            <span class="message">{{ textContext }}</span>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import type { I18nKeys } from "light-core";
import { I18n } from "light-core";
import { defineExpose, ref } from 'vue';

const textContext = ref()

const dialogRef = ref<HTMLDialogElement | null>(null);
const show = (action: () => Promise<void>, message: I18nKeys, ...args: any[]) => {
    textContext.value = I18n.translate(message, args)
    dialogRef.value?.showModal();
    action().finally(() => dialogRef.value?.close());
};

defineExpose({
    show
})
</script>

<style lang="scss" scoped>
dialog {
    border: none;
    box-shadow: 0px 1px 2px #999;
    border-radius: 16px;
    padding: 0px;
}

dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}

.loading {
    position: relative;
    width: 48px;
    height: 48px;
    border: 2px solid #000;
    border-top-color: rgba(0, 0, 0, 0.2);
    border-right-color: rgba(0, 0, 0, 0.2);
    border-bottom-color: rgba(0, 0, 0, 0.2);
    border-radius: 100%;
}

.container {
    width: fit-content;
    height: fit-content;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.message {
    margin-top: 12px;
}
</style>
<style lang="scss">
@keyframes circle {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>