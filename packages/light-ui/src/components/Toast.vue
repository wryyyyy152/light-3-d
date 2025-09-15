<template>
    <label v-if="!remove" class="toast" :class="labelClass">{{ textContext }}</label>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { I18n } from 'light-core';
import { defineExpose, ref } from 'vue';

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

<style module lang="scss">
.toast {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, 0%);
    z-index: 10000;
    border-radius: 0.8em;
    background-color: rgba(0, 0, 0, 0.75);
    font-size: 1.2em;
    padding: 1em;
}

.info {
    color: #fff;
}

.error {
    color: #ff0000;
}

.warning {
    color: #ffc107;
}
</style>
