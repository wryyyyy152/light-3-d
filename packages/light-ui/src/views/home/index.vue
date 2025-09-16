<template>
    <div :class="style.root">
        <div :class="style.left">
            <div :class="style.top">
                <div :class="style.logo">
                    <SvgIcon icon-name="icon-light"></SvgIcon>
                    <span>LIGHT3D</span>
                    <span :class="style.version">{{ appVersion }}</span>
                </div>
                <div :class="style.buttons">
                    <template v-for="ac in applicationCommands">
                        <button :class="style.button" v-i18n="{ i18nKey: ac.display }" @click="ac.onclick"></button>
                    </template>
                </div>
                <button v-if="hasDocument" :class="{[style.button]:true, [style.back]:true}" v-i18n="{ i18nKey: 'common.back' }"
                    @click="displyHome()"></button>
            </div>
            <div :class="style.settingsPanel">
                <div :class="style.settingItem">
                    <span :class="style.settingLabel" v-i18n="{ i18nKey: 'common.language' }"></span>
                    <div :class="style.settingControl">
                        <LanguageSelector></LanguageSelector>
                    </div>
                </div>
                <div :class="style.settingItem">
                    <span :class="style.settingLabel" v-i18n="{ i18nKey: 'common.theme' }"></span>
                    <div :class="style.settingControl">
                        <ThemeSelector></ThemeSelector>
                    </div>
                </div>
            </div>
        </div>
        <div :class="style.right">
            <label :class="style.welcome" v-i18n="{ i18nKey: 'home.welcome' }"></label>
            <div :class="style.recent" v-i18n="{ i18nKey: 'home.recent' }"></div>
            <div :class="style.documents">
                <template v-for="doc in documents">
                    <div :class="style.document" @click="handleDocumentClick(doc)">
                        <img :src="doc.image" :class="style.img">
                        <div :class="style.description">
                            <span :class="style.title">{{ doc.name }}</span>
                            <div :class="style.date">{{ new Date(doc.date).toLocaleDateString() }}</div>
                        </div>
                        <SvgIcon :class="style.delete" icon-name="icon-times" @click="handleDelete($event, doc)"></SvgIcon>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {
    I18nKeys,
    IApplication,
    RecentDocumentDTO
} from 'light-core';
import {
    Constants,
    I18n,
    ObservableCollection,
    PubSub
} from "light-core";
import { computed, inject, onMounted, ref } from 'vue';
import SvgIcon from '../../components/common/SvgIcon.vue';
import style from '../../styles/home.module.css';
import LanguageSelector from './LanguageSelector.vue';
import ThemeSelector from './ThemeSelector.vue';

const application = inject<IApplication>('application')!;
const appVersion = __APP_VERSION__ || '0.0.0'

interface ApplicationCommand {
    display: I18nKeys;
    icon?: string;
    onclick: () => void;
}

const applicationCommands = ref<ApplicationCommand[]>([
    {
        display: "command.doc.new",
        onclick: () => PubSub.default.pub("executeCommand", "doc.new"),
    },
    {
        display: "command.doc.open",
        onclick: () => PubSub.default.pub("executeCommand", "doc.open"),
    },
]);

const hasOpen = (documentId: string) => {
    for (const document of application.documents) {
        if (document.id === documentId) return true;
    }
    return false;
}

const getDocuments = async () => {
    return new ObservableCollection(
        ...(await application.storage.page(Constants.DBName, Constants.RecentTable, 0)),
    );
}
const documents = ref<ObservableCollection<RecentDocumentDTO> | undefined>(undefined);
const init = async () => {
    documents.value = await getDocuments();
    console.log(documents.value)
}
onMounted(() => {
    init()
})

const hasDocument = computed(() => {
    return application.activeView?.document
})
const displyHome = () => {
    PubSub.default.pub("displayHome", false);
}

const qrcode = () => {
    PubSub.default.pub("executeCommand", "wechat.group");
}

const handleDocumentClick = (item: RecentDocumentDTO) => {
    if (hasOpen(item.id)) {
        PubSub.default.pub("displayHome", false);
    } else {
        PubSub.default.pub(
            "showPermanent",
            async () => {
                let document = await application.openDocument(item.id);
                document?.application.activeView?.cameraController.fitContent();
            },
            "toast.excuting{0}",
            I18n.translate("command.doc.open"),
        );
    }
}

const handleDelete = async (e: Event, item: RecentDocumentDTO) => {
    e.stopPropagation();
    if (window.confirm(I18n.translate("prompt.deleteDocument{0}", [item.name]))) {
        await Promise.all([
            application.storage.delete(Constants.DBName, Constants.DocumentTable, item.id),
            application.storage.delete(Constants.DBName, Constants.RecentTable, item.id),
        ]);
        documents.value?.remove(item)
    }
}
</script>