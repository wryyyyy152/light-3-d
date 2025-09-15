<template>
    <select @change="handleChange($event)">
        <option v-for="lan in languages" :selected="lan.selected">{{ lan.textContent }}</option>
    </select>
</template>

<script setup lang="ts">
import { Config, I18n } from "light-core";
import { ref } from "vue";

const handleChange = (e: Event) => {
    let language = (e.target as HTMLSelectElement).selectedIndex;
    Config.instance.languageIndex = language;
}

const languages = ref<Array<{ selected: boolean, textContent: string }>>([])
I18n.languages.forEach((language, index) =>
    languages.value.push({
        selected: index === I18n.currentLanguage(),
        textContent: language.display,
    })
);
</script>

<style lang="scss" scoped></style>