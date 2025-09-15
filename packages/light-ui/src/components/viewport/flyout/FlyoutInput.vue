<template>
    <div class="panel">
        <input ref="inputRef" :value="textboxValue" @keydown="handleKeyDown($event)" :readonly="readOnly">
        <label v-if="tipContext" class="error" v-i18n="{ i18nKey: tipContext }"></label>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { Result } from "light-core";
import { defineExpose, nextTick, ref } from 'vue';

const props = defineProps<{
    text: string,
    handler: (text: string) => Result<string, I18nKeys>,
}>()

const _cancelledCallbacks: (() => void)[] = [];
const onCancelled = (callback: () => void) => {
    _cancelledCallbacks.push(callback);
}

const _completedCallbacks: (() => void)[] = [];
const onCompleted = (callback: () => void) => {
    _completedCallbacks.push(callback);
}

const inputRef=ref<HTMLDivElement | null>()
const focus = () => {
    nextTick(()=>{
        inputRef.value?.focus()
    })
}

const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
        processEnterKey();
    } else if (e.key === "Escape") {
        _cancelledCallbacks.forEach((callback) => callback());
    } else {
        removeTip();
    }
};

const readOnly = ref<boolean>(false)
const textboxValue = ref(props.text)
const processEnterKey = () => {
    readOnly.value = true;
    const error = props.handler(textboxValue.value);
    if (error.isOk) {
        _completedCallbacks.forEach((callback) => callback());
    } else {
        readOnly.value = false;
        showTip(error.error);
    }
}

const tipContext = ref<I18nKeys | undefined>(undefined)
const showTip = (tip: I18nKeys) => {
    tipContext.value = tip
}

const removeTip = () => {
    tipContext.value = undefined
}

defineExpose({
    focus,
    onCancelled,
    onCompleted
})
</script>

<style lang="scss" scoped></style>