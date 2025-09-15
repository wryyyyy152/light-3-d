<template>
    <div class="root">
        <div class="titleBar">
            <div class="left">
                <div class="appIcon" @click="handleDisplayHome">
                    <SvgIcon class="icon" icon-name="icon-light"></SvgIcon>
                    <span id="appHome">Light3D - v{{ appVersion }}</span>
                </div>
                <div class="ribbonTitlePanel">
                    <SvgIcon class="home" icon-name="icon-home" @click="handleDisplayHome"></SvgIcon>
                    <div class="quickCommands">
                        <template v-for="(command) in props.quickCommands">
                            <QuickButton :command="command" />
                        </template>
                    </div>
                    <span class="split"></span>
                    <template v-for="tab in props.ribbonTabs">
                        <label v-i18n="{ i18nKey: tab.tabName }" @click="handleChangeActiveTab(tab)"
                            :class="getRibbonTabClass(tab)">
                        </label>
                    </template>
                </div>
            </div>
            <div class="center">
                <div class="views">
                    <Collection :sources="props.application.views">
                        <template v-slot="slotProps">
                            <div :class="getViewClass(slotProps.item)" @click="handleChangeActiveView(slotProps.item)">
                                <div class="name">
                                    <span>{{ slotProps.item.document.name }}</span>
                                </div>
                                <SvgIcon class="close" icon-name="icon-times" @click="handleCloseview($event, slotProps.item)">
                                </SvgIcon>
                            </div>
                        </template>
                    </Collection>
                </div>
                <SvgIcon class="new" icon-name="icon-plus" @click="handleNewDoc()"
                    :title="I18n.translate('command.doc.new')">
                </SvgIcon>
            </div>
            <div class="right">
                <a href="https://github.com/xiangechen/chili3d" target="_blank"></a>
                <SvgIcon title="Github" class="icon" icon-name="icon-github"></SvgIcon>
            </div>
        </div>
        <div class="tabContentPanel">
            <template v-for="(ribbonTab) in props.ribbonTabs">
                <div class="groupPanel" :style="getGroupPanelStyle(ribbonTab)">
                    <template v-for="(group) in ribbonTab.groups">
                        <div class="ribbonGroup">
                            <div class="content">
                                <template v-for="item in group.items">
                                    <!-- 渲染按钮或按钮组 -->
                                    <component :is="renderButton(item)?.component" v-bind="renderButton(item)?.props" />
                                </template>
                            </div>
                            <label class="header" v-i18n="{ i18nKey: group.groupName }"></label>
                        </div>
                    </template>
                </div>
            </template>
        </div>
        <div class="commandContextPanel">
            <CommandContext v-if="receivedCommand" :command="receivedCommand"></CommandContext>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CommandKeys, I18nKeys, IApplication, ICommand, IView } from "light-core";
import { ButtonSize, Command, I18n, Logger, ObservableCollection, PubSub } from "light-core";
import { onMounted, onUnmounted, ref } from 'vue';
import Collection from "../common/Collection.vue";
import SvgIcon from '../common/SvgIcon.vue';
import CommandContext from './commandContext/index.vue';
import QuickButton from './QuickButton.vue';
import RibbonButton from "./RibbonButton.vue";
import type { RibbonCommandData, RibbonTabData } from "./ribbonData";
import RibbonStack from "./RibbonStack.vue";

const props = defineProps<{
    application: IApplication,
    quickCommands: CommandKeys[],
    ribbonTabs: RibbonTabData[],
}>();

// let _activeTab: RibbonTabData = props.ribbonTabs[0];
const _activeTabName = ref<I18nKeys>(props.ribbonTabs[0].tabName);
const _activeView = ref<IView|undefined>();

PubSub.default.sub("activeViewChanged", (v: IView | undefined) => (_activeView.value = v));

// 从环境变量或配置中获取应用版本
const appVersion = __APP_VERSION__ || '0.0.0'

const handleDisplayHome = () => {
    PubSub.default.pub("displayHome", true)
}
const handleChangeActiveTab = (tab: RibbonTabData) => {
    _activeTabName.value = tab.tabName
}

const handleChangeActiveView = (view: IView) => {
    _activeView.value = view
}
const handleCloseview = (e: Event, view: IView) => {
    e.stopPropagation();
    view.close();
}
const handleNewDoc = () => {
    PubSub.default.pub("executeCommand", "doc.new")
}

// 决定渲染哪种组件（按钮或按钮组）
const renderButton = (item: RibbonCommandData): {
    component: any,
    props: { [key: string]: any }
} | undefined => {
    if (typeof item === 'string') {
        const data = Command.getData(item);
        if (!data) {
            Logger.warn(`commandData of ${item} is undefined`);
            return undefined;
        }
        return {
            component: RibbonButton,
            props: {
                display: `command.${data.key}`,
                icon: data.icon,
                size: ButtonSize.large,
                commandName: data.key,
                isToggle: !!data.toggle,
                toggleData: data.toggle,
                onClick: () => {
                    PubSub.default.pub("executeCommand", data.key);
                }
            }
        }; // 字符串类型：渲染单个大按钮
    } else if (item instanceof ObservableCollection) {
        // 集合类型：渲染按钮组
        return {
            component: RibbonStack,
            props: {
                buttons: item
            }
        };
    } else {
        return {
            component: RibbonButton,
            props: {
                display: item.display,
                icon: item.icon,
                size: ButtonSize.large,
                onClick: item.onClick
            }
        }
    };
}

const getRibbonTabClass = (tab: RibbonTabData): string => {
    return _activeTabName.value === tab.tabName ? 'tabHeader activedTab' : 'tabHeader'
}
const getViewClass = (view: IView): string => {
    return _activeView.value === view ? 'tab active' : 'tab'
}
const getGroupPanelStyle = (tab: RibbonTabData): string => {
    return _activeTabName.value === tab.tabName ? "" : "display:none"
}

onMounted(() => {
    PubSub.default.sub("openCommandContext", _openContext);
    PubSub.default.sub("closeCommandContext", _closeContext);
})

onUnmounted(() => {
    PubSub.default.remove("openCommandContext", _openContext);
    PubSub.default.remove("closeCommandContext", _closeContext);
})

const receivedCommand = ref<ICommand | undefined>(undefined)
const _openContext = (command: ICommand) => {
    console.log('-------_openContext-------')
    receivedCommand.value = command
};

const _closeContext = () => {
    receivedCommand.value = undefined
};
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.split {
    width: 1px;
    height: 14px;
    margin: 0px 8px;
    background-color: rgba(128, 128, 128, 0.45);
}

.titleBar {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 2px 4px;

    .left {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-self: center;

        .appIcon {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-self: center;
            border-radius: 8px;
            padding: 4px 8px;
            margin: 2px;
            cursor: pointer;

            &:hover {
                background-color: var(--hover-background-color);
            }

            .icon {
                width: 24px;
                height: 24px;
                padding: 2px;
            }

            span {
                margin-left: 16px;
                font-weight: bolder;
                text-wrap: nowrap;
            }
        }
    }

    .center {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: auto;
        flex: 0 1 auto;
        overflow: auto;

        .views {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-radius: 8px;
            padding: 2px 0px;
            overflow: hidden;

            .tab {
                display: flex;
                flex-direction: row;
                align-items: center;
                border-radius: 6px;
                height: 26px;
                background-color: var(--title-background);
                padding: 2px;
                width: 220px;
                overflow: hidden;
                margin: 0px 2px;
                cursor: default;
                transition: width 0.2s ease-out;

                &:hover {
                    background-color: var(--hover-background-color);
                }

                .name {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-right: auto;
                    margin-left: 8px;
                    text-wrap: nowrap;
                    user-select: none;
                    text-decoration: dashed;
                    overflow: hidden;

                    .split {
                        padding: 0px 4px;
                    }

                    span {
                        font-size: 12px;
                    }
                }

                .close {
                    width: 14px;
                    height: 14px;
                    margin: 4px;
                    padding: 4px;
                    border-radius: 6px;
                    flex-shrink: 0;

                    &:hover {
                        background-color: var(--hover-background-color);
                    }
                }
            }

            .active {
                width: 260px;
                background-color: var(--title-checked);
            }
        }

        .new {
            width: 14px;
            height: 14px;
            margin-left: 2px;
            padding: 4px;
            border-radius: 6px;

            &:hover {
                background-color: var(--hover-background-color);
            }
        }
    }

    .right {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 2px 8px;
        flex: 0 0 auto;

        .icon {
            width: 24px;
            height: 24px;
            padding: 4px;
            border-radius: 4px;

            &:hover {
                background-color: var(--hover-background-color);
            }
        }
    }
}

.ribbonTitlePanel {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px 4px;
    flex: 0 0 auto;

    .home {
        width: 14px;
        height: 14px;
        padding: 4px;
        border-radius: 4px;
        margin: 0px 4px;

        &:hover {
            background-color: var(--hover-background-color);
        }
    }

    & .quickCommands {
        display: flex;
        flex-direction: row;

        ::v-deep .quick-button {
            width: 14px;
            height: 14px;
            padding: 4px;
            border-radius: 4px;
            margin: 0px 6px;

            &:hover {
                background-color: var(--hover-background-color);
            }
        }
    }

    .tabHeader {
        color: var(--titlebar-forground-color);
        padding: 5px 15px;

        &:hover {
            -webkit-text-stroke: 0.65px var(--foreground-color);
            background-color: var(--hover-background-color);
        }
    }

    .activedTab {
        position: relative;

        &::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 8px;
            right: 8px;
            height: 3px;
            background-color: var(--primary-color);
        }
    }
}

.tabContentPanel {
    display: flex;
    flex-direction: row;
    background-color: var(--panel-background-color);
    border-bottom: 1px solid var(--border-color);
    overflow-x: auto;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--foreground-muted-color);
        border-radius: 5px;
    }

    & .groupPanel {
        display: flex;
        flex-direction: row;
    }
}

.commandContextPanel {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    flex: 1 1 auto;
    height: 32px;
    background-color: var(--panel-background-color);
    border-bottom: 1px solid var(--border-color);
}

.ribbonGroup {
    position: relative;
    display: grid;
    grid-template-rows: 1fr auto;
    justify-items: center;
    flex-shrink: 0;

    .header {
        color: var(--foreground-color);
        font-size: 12px;
    }

    .content {
        height: 72px;
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-items: center;
        overflow: hidden;
    }
}

.ribbonGroup::after {
    content: "";
    position: absolute;
    display: grid;
    right: 0px;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background-color: var(--border-color);
}
</style>