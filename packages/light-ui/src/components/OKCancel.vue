<template>
    <div :class="style.root" :style="{ visibility: isVisible ? 'visible' : 'hidden' }">
        <div :class="style.container">
            <span v-i18n="{ i18nKey: 'ribbon.group.selection' }"></span>
            <div :class="style.spacer"></div>
            <div :class="style.panel">
                <div :class="style.icon" @click="_onConfirm">
                    <SvgIcon icon-name="icon-confirm"></SvgIcon>
                    <span v-i18n="{ i18nKey: 'common.confirm' }"></span>
                </div>
                <div :class="style.icon" @click="_onCancel">
                    <SvgIcon icon-name="icon-cancel"></SvgIcon>
                    <span v-i18n="{ i18nKey: 'common.cancel' }"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AsyncController } from "light-core";
import { ref } from "vue";
import style from '../styles/okCancel.module.css';
import SvgIcon from './common/SvgIcon.vue';

const control = ref<AsyncController | undefined>(undefined);

const setControl = (_control: AsyncController | undefined) => {
    control.value = _control;
}

const _onConfirm = () => {
    control.value?.success();
};

const _onCancel = () => {
    control.value?.cancel();
};

const isVisible = ref<boolean>(false)
const setVisible = () => {
    isVisible.value = false
}
const setHidden = () => {
    isVisible.value = true
}

defineExpose({
    setVisible,
    setHidden,
    setControl
})
</script>