<template>
    <div :class="style.root">
        <div :class="style.titleBar">
            <div :class="style.left">
                <div :class="style.appIcon" @click="handleDisplayHome">
                    <SvgIcon :class="style.icon" icon-name="icon-light"></SvgIcon>
                    <span id="appHome">Light3D - v{{ appVersion }}</span>
                </div>
                <div :class="style.ribbonTitlePanel">
                    <SvgIcon :class="style.home" icon-name="icon-home" @click="handleDisplayHome"></SvgIcon>
                    <div :class="style.quickCommands">
                        <template v-for="(command) in props.quickCommands">
                            <QuickButton :command="command" />
                        </template>
                    </div>
                    <span :class="style.split"></span>
                    <template v-for="tab in props.ribbonTabs">
                        <label v-i18n="{ i18nKey: tab.tabName }" @click="handleChangeActiveTab(tab)"
                            :class="getRibbonTabClass(tab)">
                        </label>
                    </template>
                </div>
            </div>
            <div :class="style.center">
                <div :class="style.views">
                    <Collection :sources="props.application.views">
                        <template v-slot="slotProps">
                            <div :class="getViewClass(slotProps.item)" @click="handleChangeActiveView(slotProps.item)">
                                <div :class="style.name">
                                    <span>{{ slotProps.item.document.name }}</span>
                                </div>
                                <SvgIcon :class="style.close" icon-name="icon-times" @click="handleCloseview($event, slotProps.item)">
                                </SvgIcon>
                            </div>
                        </template>
                    </Collection>
                </div>
                <SvgIcon :class="style.new" icon-name="icon-plus" @click="handleNewDoc()"
                    :title="I18n.translate('command.doc.new')">
                </SvgIcon>
            </div>
            <div :class="style.right">
                <a href="https://github.com/wryyyyy152/light-3-d" target="_blank">
                    <SvgIcon title="Github" :class="style.icon" icon-name="icon-github"></SvgIcon>
                </a>
            </div>
        </div>
        <div :class="style.tabContentPanel">
            <template v-for="(ribbonTab) in props.ribbonTabs">
                <div :class="style.groupPanel" :style="getGroupPanelStyle(ribbonTab)">
                    <template v-for="(group) in ribbonTab.groups">
                        <div :class="style.ribbonGroup">
                            <div :class="style.content">
                                <template v-for="item in group.items">
                                    <!-- 渲染按钮或按钮组 -->
                                    <component :is="renderButton(item)?.component" v-bind="renderButton(item)?.props" />
                                </template>
                            </div>
                            <label :class="style.header" v-i18n="{ i18nKey: group.groupName }"></label>
                        </div>
                    </template>
                </div>
            </template>
        </div>
        <div :class="style.commandContextPanel">
            <CommandContext v-if="receivedCommand" :command="receivedCommand"></CommandContext>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CommandKeys, I18nKeys, IApplication, ICommand, IView } from "light-core";
import { ButtonSize, Command, I18n, Logger, ObservableCollection, PubSub } from "light-core";
import { onMounted, onUnmounted, ref, toRaw } from 'vue';
import style from '../../styles/ribbon.module.css';
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
    const _view = toRaw(view)
    _view.close()
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
    return _activeTabName.value === tab.tabName ? `${style.tabHeader} ${style.activedTab}` : style.tabHeader
}
const getViewClass = (view: IView): string => {
    return _activeView.value === view ? `${style.tab} ${style.active}` : style.tab
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
    receivedCommand.value = command
};

const _closeContext = () => {
    receivedCommand.value = undefined
};
</script>