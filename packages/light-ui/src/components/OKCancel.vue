<template>
    <div class="root" :style="{ visibility: isVisible ? 'visible' : 'hidden' }">
        <div class="container">
            <span v-i18n="{ i18nKey: 'ribbon.group.selection' }"></span>
            <div class="spacer"></div>
            <div class="panel">
                <div class="icon" @click="_onConfirm">
                    <SvgIcon icon-name="icon-confirm"></SvgIcon>
                    <span v-i18n="{ i18nKey: 'common.confirm' }"></span>
                </div>
                <div class="icon" @click="_onCancel">
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

<style lang="scss" scoped>
.root {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-color: var(--panel-background-color);
    padding: 6px;

    .panel {
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            padding: 4px;

            &:hover {
                background-color: var(--hover-background-color);
            }

            svg {
                width: 24px;
                height: 24px;
                margin: 4px;
            }

            span {
                font-size: 12px;
                user-select: none;
                cursor: default;
            }
        }
    }

    .spacer {
        height: 1px;
        width: 100%;
        background-color: var(--border-color);
        margin: 6px 0px;
    }
}
</style>