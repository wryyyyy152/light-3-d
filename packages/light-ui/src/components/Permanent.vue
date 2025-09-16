<template>
    <dialog ref="dialogRef">
        <div :class="style.container">
            <div :class="style.loading" :style="{ animation: `circle infinite 0.75s linear` }"></div>
            <span :class="style.message">{{ textContext }}</span>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import type { I18nKeys } from "light-core";
import { I18n } from "light-core";
import { defineExpose, ref } from 'vue';
import style from '../styles/permanent.module.css';

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