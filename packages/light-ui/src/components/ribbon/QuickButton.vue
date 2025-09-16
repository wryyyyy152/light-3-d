<template>
    <SvgIcon v-if="data" :icon-name="data?.icon" :title="localizedTitle" @click="executeCommand">
    </SvgIcon>
    <span v-else></span>
</template>

<script setup lang="ts">
import type { CommandData, ICommand } from "light-core";
import { Command, I18n, Logger, PubSub } from "light-core";
import { computed, defineProps, ref } from 'vue';

const props = defineProps<{
    command: any,
}>();

// 命令数据
const data = ref<CommandData | undefined>(undefined)

// 本地化标题
const localizedTitle = computed(() => {
    return data.value ? I18n.translate(`command.${data.value.key}`) : 'null'
})

// 获取命令数据
const fetchCommandData = () => {
    try {
        const result = Command.getData(props.command as ICommand)
        if (!result) {
            Logger.warn("commandData is undefined")
            return
        }
        data.value = result
    } catch (error) {
        Logger.error("Failed to get command data:", error)
    }
}
fetchCommandData()

// 执行命令
const executeCommand = () => {
    if (data.value) PubSub.default.pub("executeCommand", data.value.key)
}
</script>