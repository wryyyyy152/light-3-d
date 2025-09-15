<template>
    <dialog ref="dialogRef">
        <div class="root">
            <div class="title">{{ translatedTitle }}</div>
            <div class="content" :inner-h-t-m-l="content"></div>
            <div class="buttons">
                <button @click="handleConfirm()">{{ I18n.translate('common.confirm') }}</button>
                <button @click="handleCancel()">{{ I18n.translate('common.cancel') }}</button>
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core'
import { DialogResult, I18n } from 'light-core'
import { computed, defineExpose, ref } from 'vue'

const title = ref<I18nKeys>()
const content = ref<HTMLElement>()
const callback = ref<(result: DialogResult) => void>()
const dialogRef = ref<HTMLDialogElement | null>(null);

const translatedTitle = computed(() => {
    if (title.value) return I18n.translate(title.value)
    return 'light3d'
})

const show = (_title: I18nKeys, _content: HTMLElement, _callback?: (result: DialogResult) => void) => {
    title.value = _title
    content.value = _content
    callback.value = _callback
    dialogRef.value?.showModal()
}

const handleConfirm = () => {
    dialogRef.value?.close()
    callback.value?.(DialogResult.ok);
}

const handleCancel = () => {
    dialogRef.value?.close()
    callback.value?.(DialogResult.cancel);
}

defineExpose({
    show
})
</script>

<style lang="scss" scoped>
dialog {
    border: none;
    box-shadow: 0px 5px 10px #646464;
    padding: 0px;
    background-color: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(5px);
}

dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.75);
}

.root {
    display: flex;
    flex-direction: column;
    margin: 0px;
    padding: 0px;
}

.title {
    padding-top: 16px;
    padding-bottom: 8px;
    font-size: 1.5em;
    font-weight: bold;
    margin: 0px auto;
    flex-shrink: 0;
}

.content {
    padding: 16px;
    max-width: 1080px;
    max-height: 680px;
    flex: 1 1 auto;
    overflow: auto;
}

.buttons {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    justify-content: flex-end;
    padding: 8px;
    background-color: rgba(255, 255, 255, 0.56);

    & button {
        width: 64px;
        margin: 6px;
        padding: 4px;
        font-size: 1em;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background-color: var(--panel-background-color);
        color: var(--foreground-color);

        &:hover {
            background-color: var(--hover-background-color);
        }
        &:active {
            background-color: var(--primary-color);
            color: var(--title-checked);
        }
    }
}
</style>