<template>
    <label v-if="!remove" :class="[style.toast, labelClass]">{{ textContext }}</label>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { I18n } from 'light-core';
import { defineExpose, ref } from 'vue';
import style from '../styles/toast.module.css';

let _lastToast: number | undefined;
const remove = ref<boolean>(true)
const labelClass = ref<string>('')
const textContext = ref()

const after = () => {
    if (_lastToast) {
        clearTimeout(_lastToast);
    }

    remove.value = false
    _lastToast = window.setTimeout(() => {
        _lastToast = undefined;
        remove.value = true
    }, 2000)
}

const info = (message: I18nKeys, ...args: any[]) => {
    labelClass.value = 'info'
    textContext.value = I18n.translate(message, ...args)
    after()
};

const error = (message: string) => {
    labelClass.value = 'error'
    textContext.value = message
    after()
};

const warn = (message: string) => {
    labelClass.value = 'warning'
    textContext.value = message
    after()
};

defineExpose({
    info,
    error,
    warn
})
</script>