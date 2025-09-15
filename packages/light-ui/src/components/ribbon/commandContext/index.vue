<template>
    <div class="panel">
        <SvgIcon class="icon" :icon-name="data!.icon"></SvgIcon>
        <label class="title" v-i18n="{ i18nKey: `command.${data!.key}` }"></label>
    </div>

    <!-- 属性分组 -->
    <template v-for="group in groupedProperties">
        <div class="group">
            <!-- 根据属性类型渲染不同控件 -->
            <div :v-show="visible(group)">
                <template v-if="group.type === 'materialId'">
                    <MaterialButton :command="command" :group="group" class="materialButton" />
                </template>

                <template v-else-if="getItemType(group) === 'function'">
                    <ContextButton :command="command" :group="group" class="button" />
                </template>

                <template v-else-if="getItemType(group) === 'boolean'">
                    <CheckBox :command="command" :group="group" />
                </template>

                <template v-else-if="getItemType(group) === 'number'">
                    <ContextInput :command="command" :group="group" :converter="parseFloat" />
                </template>

                <template v-else-if="getItemType(group) === 'string'">
                    <ContextInput :command="command" :group="group" />
                </template>

                <template v-else-if="isCombobox(group)">
                    <ComboboxControl :command="command" :group="group" />
                </template>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import type { CommandData, ICommand } from 'light-core';
import { Combobox, Command, Property } from 'light-core';
import { computed, ref } from 'vue';
import SvgIcon from '../../common/SvgIcon.vue';
import CheckBox from './CheckBox.vue';
import ComboboxControl from './Combobox.vue';
import ContextButton from './ContextButton.vue';
import ContextInput from './ContextInput.vue';
import MaterialButton from './MaterialButton.vue';

const props = defineProps<{
    command: ICommand,
}>();

const data = ref<CommandData | undefined>(Command.getData(props.command))
const groupedProperties = computed<Property[]>(() => {
    return Property.getProperties(props.command)
})
const getItemType = (g: Property): string => {
    const noType = props.command as any;
    const type = typeof noType[g.name];
    return type
}
const isCombobox = (g: Property): boolean => {
    const noType = props.command as any;
    return noType[g.name] instanceof Combobox;
}

const visible = (group: Property): boolean => {
    if (group.dependencies) {
        for (const d of group.dependencies) {
            if ((props.command as any)[d.property] !== d.value) {
                return false;
            }
        }
    }
    return true;
}
</script>

<style lang="scss">
.panel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 2px 8px;
    gap: 12px;
}

.title {
    font-weight: bold;
}

.group {
    display: flex;
    margin-left: 6px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
}

.button {
    padding: 2px 12px;
    font-size: 1em;
    border-radius: 6px;
    color: var(--foreground-color);
    border: 1px solid var(--border-color);
    background-color: var(--control-background-color);

    &:hover {
        background-color: var(--hover-background-color);
    }
}

.icon {
    width: 14px;
    height: 14px;
}

.input {
    margin-left: 8px;
    width: 64px;
    background-color: var(--input-background-color);
    border: 1px solid var(--input-border-color);
    color: var(--input-text-color);
}

.select {
    margin-left: 8px;
    padding: 2px 12px;
    font-size: 1em;
    border-radius: 6px;
    color: var(--foreground-color);
    border: 1px solid var(--border-color);
    background-color: var(--control-background-color);
}

.materialButton {
    flex: 1 1 auto;
    font-size: 1rem;
    padding: 2px 24px;
    outline: none;
    background-color: transparent;

    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin: 0px;

    &:hover {
        background-color: var(--hover-background-color);
    }
}
</style>