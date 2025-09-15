<template>
    <div class="root">
        <div class="left">
            <div class="top">
                <div class="logo">
                    <SvgIcon icon-name="icon-light"></SvgIcon>
                    <span>LIGHT3D</span>
                    <span class="version">{{ appVersion }}</span>
                </div>
                <div class="buttons">
                    <template v-for="ac in applicationCommands">
                        <button class="button" v-i18n="{ i18nKey: ac.display }" @click="ac.onclick"></button>
                    </template>
                </div>
                <button v-if="hasDocument" class="button back" v-i18n="{ i18nKey: 'common.back' }"
                    @click="displyHome()"></button>
            </div>
            <div class="settingsPanel">
                <div class="settingItem">
                    <span class="settingLabel" v-i18n="{ i18nKey: 'common.language' }"></span>
                    <div class="settingControl">
                        <LanguageSelector></LanguageSelector>
                    </div>
                </div>
                <div class="settingItem">
                    <span class="settingLabel" v-i18n="{ i18nKey: 'common.theme' }"></span>
                    <div class="settingControl">
                        <ThemeSelector></ThemeSelector>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <label class="welcome" v-i18n="{ i18nKey: 'home.welcome' }"></label>
            <div class="recent" v-i18n="{ i18nKey: 'home.recent' }"></div>
            <div class="documents">
                <template v-for="doc in documents">
                    <div class="document" @click="handleDocumentClick(doc)">
                        <img :src="doc.image" class="img">
                        <div class="description">
                            <span class="title">{{ doc.name }}</span>
                            <div class="date">{{ new Date(doc.date).toLocaleDateString() }}</div>
                        </div>
                        <SvgIcon class="delete" icon-name="icon-times" @click="handleDelete($event, doc)"></SvgIcon>
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

<style lang="scss" scoped>
.root {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    flex-direction: row;
    background-color: var(--panel-background-color);
}

.left {
    display: flex;
    flex-direction: column;
    flex: 0 0 320px;
    background-color: var(--background-color);
    padding-bottom: 64px;
    justify-content: space-between;
    position: relative;

    & .top {
        display: flex;
        flex-direction: column;
        margin-bottom: auto;

        .buttons {
            display: flex;
            flex-direction: column;
        }

        .button {
            display: inline-block;
            height: 48px;
            width: auto;
            font-size: 16px;
            margin: 8px 32px;
            padding: 0px 32px;
            border-radius: 8px;
            border-width: 0px;
            background-color: var(--button-secondary-background);
            color: var(--foreground-color);
            transition: all 0.2s ease;
            cursor: pointer;

            &:hover {
                background-color: var(--button-secondary-hover);
            }

            &:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        }

        .back {
            background-color: var(--button-primary-background);
            color: white;

            &:hover {
                background-color: var(--button-primary-hover);
            }
        }

        & .logo {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 32px;

            & svg {
                width: 64px;
                height: 64px;
                color: var(--foreground-color);
                fill: currentColor;
            }

            & span {
                margin-top: 10px;
                color: var(--foreground-color);
                letter-spacing: 6px;
                font-size: 24px;
                font-weight: bold;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            }

            .version {
                font-size: 14px;
                margin-top: 4px;
                letter-spacing: 0px;
                color: var(--foreground-muted-color);
            }
        }
    }

    & .settingsPanel {
        display: flex;
        flex-direction: column;
        gap: 8px;

        & .settingItem {
            display: flex;
            align-items: center;
            margin: 0px 32px;
            padding: 8px 16px;
            justify-content: space-between;
            border-radius: 10px;
            background-color: var(--panel-background-color);
            border: 1px solid var(--border-color);
        }

        & .settingLabel {
            font-size: 16px;
            margin-right: 10px;
            white-space: nowrap;
            color: var(--foreground-color);
        }

        & .settingControl {
            margin-left: auto;
            min-width: 0;
            padding: 2px;

            select {
                width: 108px;
                height: 28px;
                padding: 0px 6px;
                border-radius: 6px;
                border: 1px solid var(--input-border-color);
                background-color: var(--input-background-color);
                color: var(--input-text-color);
                font-size: 14px;

                &:hover {
                    border-color: var(--border-hover-color);
                }

                &:focus {
                    outline: none;
                    border-color: var(--primary-color);
                }
            }
        }
    }

    .socialPanel {
        display: flex;
        gap: 8px;
        align-items: stretch;
        justify-content: center;
        margin-top: 8px;
        padding: 0px 32px;

        .socialItem {
            flex: 1;
            color: var(--foreground-color);
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background-color: var(--panel-background-color);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            cursor: pointer;

            &:hover {
                background-color: var(--panel-hover-background-color);
                border-color: var(--border-hover-color);
            }

            &:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }

            svg {
                width: 24px;
                height: 24px;
                padding: 4px;
                opacity: 0.75;
                color: var(--foreground-color);
                fill: currentColor;
            }
        }
    }
}

.right {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    padding: 16px;

    & .welcome {
        font-size: 26px;
        margin-top: 48px;
        align-self: center;
        color: var(--foreground-color);
    }

    & .recent {
        display: flex;
        font-size: 18px;
        font-weight: bolder;
        margin: 16px 64px;
        color: var(--foreground-color);
    }

    & .documents {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow-y: scroll;
        flex: 1;
        align-items: flex-start;
        gap: 32px;
        margin: 0px 64px;
        padding-right: 12px;
        --delete-visibility: hidden;

        & .document {
            position: relative;
            display: flex;
            flex: 1 1 240px;
            flex-direction: column;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.2s ease;
            cursor: pointer;

            &:hover {
                opacity: 0.9;
                background-color: var(--panel-hover-background-color);
                --delete-visibility: visible;
                transform: translateY(-2px);
            }

            & .img {
                object-fit: cover;
                height: 180px;
                padding: 16px;
                border-radius: 8px;
                background-color: var(--background-color);
                border: 1px solid var(--border-color);
            }

            & .description {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin: 4px 4px;

                & .title {
                    font-size: 14px;
                    color: var(--foreground-color);
                }

                & .date {
                    font-size: 12px;
                    color: var(--foreground-muted-color);
                }
            }

            .delete {
                position: absolute;
                visibility: var(--delete-visibility);
                padding: 4px;
                width: 16px;
                height: 16px;
                top: 8px;
                right: 8px;
                border-radius: 50%;
                color: var(--foreground-color);
                background-color: var(--panel-background-color);
                border: 1px solid var(--border-color);
                transition: all 0.2s ease;
                cursor: pointer;

                &:hover {
                    background-color: var(--panel-hover-background-color);
                    border-color: var(--border-hover-color);
                    transform: scale(1.1);
                }

                &:focus {
                    outline: 2px solid var(--primary-color);
                    outline-offset: 2px;
                }

                svg {
                    color: var(--foreground-color);
                    fill: currentColor;
                }
            }
        }
    }
}
</style>