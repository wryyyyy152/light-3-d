<template>
    <div class="root">
        <Ribbon :application="application" :quick-commands="quickCommands" :ribbon-tabs="ribbonTabs" />
        <div class="content">
            <div class="sidebar">
                <ProjectView class="sidebarItem" class-name="sidebarItem"></ProjectView>
                <PropertyView class="sidebarItem" class-name="sidebarItem"></PropertyView>
            </div>
            <div class="viewportContainer">
                <MaterialEditor v-if="context" :data-content="context"></MaterialEditor>
                <OKCancel ref="_selectionController"></OKCancel>
                <LayoutViewport :app="application" class="viewport"></LayoutViewport>
            </div>
        </div>
        <Statusbar  class="statusbar" class-name="statusbar"></Statusbar>
    </div>
</template>

<script setup lang="ts">
import type { Button, CommandKeys, I18nKeys, IApplication, IDocument, Material, RibbonTab } from "light-core";
import { AsyncController, PubSub, } from "light-core";
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import OKCancel from "../../components/OKCancel.vue";
import ProjectView from '../../components/project/index.vue';
import PropertyView from '../../components/property/index.vue';
import { MaterialDataContent } from "../../components/property/material/materialDataContent";
import MaterialEditor from '../../components/property/material/MaterialEditor.vue';
import Ribbon from '../../components/ribbon/index.vue';
import { RibbonTabData } from '../../components/ribbon/ribbonData';
import Statusbar from '../../components/statusbar/index.vue';
import LayoutViewport from '../../components/viewport/LayoutViewport.vue';

const application = inject<IApplication>('application')!;
const tabs = inject<RibbonTab[]>('tabs')!;

const ribbonTabs = computed(() => {
    return tabs.map(RibbonTabData.fromProfile);
})

const quickCommands: CommandKeys[] = ["doc.save", "doc.saveToFile", "edit.undo", "edit.redo"];

const registerRibbonCommand = (tabName: I18nKeys, groupName: I18nKeys, command: CommandKeys | Button) => {
    // todo
    const tab = ribbonTabs.value.find((p) => p.tabName === tabName);
    const group = tab?.groups.find((p) => p.groupName === groupName);
    group?.items.push(command);
}

PubSub.default.sub("registerRibbonCommand", (tabName, groupName, command) => registerRibbonCommand(tabName, groupName, command));

onMounted(() => {
    PubSub.default.sub("showSelectionControl", showSelectionControl);
    PubSub.default.sub("editMaterial", _handleMaterialEdit);
    PubSub.default.sub("clearSelectionControl", clearSelectionControl);
})

onUnmounted(() => {
    PubSub.default.remove("showSelectionControl", showSelectionControl);
    PubSub.default.remove("editMaterial", _handleMaterialEdit);
    PubSub.default.remove("clearSelectionControl", clearSelectionControl);
})

const _selectionController = ref<InstanceType<typeof OKCancel> | null>(null)

const showSelectionControl = (controller: AsyncController) => {
    if (_selectionController.value) {
        _selectionController.value.setControl(controller);
        _selectionController.value.setVisible();
    }
};

const clearSelectionControl = () => {
    if (_selectionController.value) {
        _selectionController.value.setControl(undefined);
        _selectionController.value.setHidden();
    }
};

const context = ref<MaterialDataContent | undefined>()

const _handleMaterialEdit = (
    document: IDocument,
    editingMaterial: Material,
    callback: (material: Material) => void,
) => {
    context.value = new MaterialDataContent(document, callback, editingMaterial);
};
</script>

<style lang="scss" scoped>
.root {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
}

.content {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    flex: 1 1 auto;
    height: 0;

    & .sidebar {
        display: flex;
        flex-direction: column;
        min-width: 150px;
        max-width: 85%;
        background-color: var(--background-color);
        position: relative;

        & .sidebarItem {
            margin-top: 10px;
            overflow: hidden;
            flex: 1 1 auto;
            height: 0;
        }
    }

    & .viewportContainer {
        position: relative;
        background-color: var(--viewport-background-color);
        flex: 1 1 auto;
        width: 0;

        .viewport {
            height: 100%;
            position: relative;
        }
    }
}

.sidebarResizer {
    width: 6px;
    cursor: ew-resize;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: var(--resizer-gradient);
    transition: background 0.2s;
}
.sidebarResizer:hover {
    background: var(--resizer-gradient-hover);
}

.statusbar {
    height: 24px;
    display: flex;
    flex-direction: column;
}
</style>
<style lang="scss">
@media (max-width: 680px) {
    .content {
        flex-direction: column-reverse;
        min-height: 0;

        & .viewportContainer {
            height: 100px;
            width: 100%;
        }

        & .sidebar {
            display: none;
            flex: 1 1 auto;
            width: 100%;
        }
    }
}
</style>