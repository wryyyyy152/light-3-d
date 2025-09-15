<template>
    <div class="root">
        <template v-for="artibute in filteredList">
            <RibbonButton v-bind="artibute"></RibbonButton>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { CommandData, CommandKeys, I18nKeys, ObservableCollection } from 'light-core';
import { ButtonSize, Command, Logger, PubSub } from 'light-core';
import { computed } from 'vue';
import RibbonButton from './RibbonButton.vue';

const props = defineProps<{
    buttons: ObservableCollection<CommandKeys>,
}>();

interface RibbonButtonProp {
    display: I18nKeys,
    icon: string;
    size: ButtonSize;
    onClick?: () => void;
    commandName?: CommandKeys;
    isToggle?: boolean;
    toggleData?: CommandData['toggle'];
}

// 过滤后的列表计算属性
const filteredList = computed<RibbonButtonProp[]>(() => {
    const list = [] as RibbonButtonProp[]
    props.buttons.forEach((b) => {
        const data = Command.getData(b);
        if (!data) {
            Logger.warn(`commandData of ${b} is undefined`);
            return undefined;
        }
        list.push({
            display: `command.${data.key}`,
            icon: data.icon,
            size: ButtonSize.small,
            commandName: data.key,
            isToggle: !!data.toggle,
            toggleData: data.toggle,
            onClick: () => {
                PubSub.default.pub("executeCommand", data.key);
            }
        })
    })
    return list;
});
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}
</style>