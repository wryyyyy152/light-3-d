<template>
    <div class="root">
        <tip v-if="tipProp" :msg="tipProp.msg" :type="tipProp.type"></tip>
        <flyout-input v-if="inputProp" ref="inputRef" :text="inputProp.text"
            :handler="inputProp.handler"></flyout-input>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys, MessageType, Result } from 'light-core';
import { PubSub } from 'light-core';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import FlyoutInput from './FlyoutInput.vue';
import Tip from './Tip.vue';

onMounted(() => {
    PubSub.default.sub("showFloatTip", showTip);
    PubSub.default.sub("clearFloatTip", clearTip);
    PubSub.default.sub("showInput", displayInput);
    PubSub.default.sub("clearInput", clearInput);
})

onUnmounted(() => {
    PubSub.default.remove("showFloatTip", showTip);
    PubSub.default.remove("clearFloatTip", clearTip);
    PubSub.default.remove("showInput", displayInput);
    PubSub.default.remove("clearInput", clearInput);
})

const tipProp = ref<{ msg: string, type: MessageType } | undefined>()
const showTip = (level: MessageType, msg: string) => {
    tipProp.value = { msg: msg, type: level }
};
const clearTip = () => {
    tipProp.value = undefined
};

let lastFocus: HTMLElement | null = null;
const inputProp = ref<{ text: string, handler: (text: string) => Result<string, I18nKeys> } | undefined>()
const inputRef = ref<InstanceType<typeof FlyoutInput>>()
const displayInput = (text: string, handler: (text: string) => Result<string, I18nKeys>) => {
    if (inputProp.value === undefined) lastFocus = document.activeElement as HTMLElement;
    inputProp.value = { text, handler }
    nextTick(() => {
        inputRef.value?.onCancelled(clearInput);
        inputRef.value?.onCompleted(clearInput);
        inputRef.value?.focus()
    })
};
const clearInput = () => {
    inputProp.value = undefined
    if (inputProp.value !== undefined) lastFocus?.focus();
};
</script>

<style lang="scss" scoped>
.root {
    position: absolute;
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    margin-left: 15px;
    opacity: 0.75;
    z-index: 888;
}
</style>