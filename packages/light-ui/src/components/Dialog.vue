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

<style lang="scss" scoped></style>