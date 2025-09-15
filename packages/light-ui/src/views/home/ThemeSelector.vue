<template>
    <select @change="handleChange($event)">
        <option v-for="the in themeOptions" :selected="the.selected" v-i18n="{ i18nKey: the.textKey }"
            :value="the.value"></option>
    </select>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { Config } from "light-core";
import { ref } from "vue";

const handleChange = (e: Event) => {
    let themeMode = (e.target as HTMLSelectElement).value as "light" | "dark" | "system";
    Config.instance.themeMode = themeMode;
}

const themes = [
    { value: "light", key: "common.theme.light" },
    { value: "dark", key: "common.theme.dark" },
    { value: "system", key: "common.theme.system" },
];

const themeOptions = ref<Array<{ selected: boolean, textKey: I18nKeys, value: string }>>([])

themes.forEach((theme) =>
    themeOptions.value.push({
        selected: theme.value === Config.instance.themeMode,
        textKey: theme.key as I18nKeys,
        value: theme.value,
    })
);
</script>

<style lang="scss" scoped></style>