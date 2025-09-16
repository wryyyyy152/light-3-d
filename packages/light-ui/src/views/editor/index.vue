<template>
    <div :class="style.root">
        <Ribbon :application="application" :quick-commands="quickCommands" :ribbon-tabs="ribbonTabs" />
        <div :class="style.content">
            <div :class="style.sidebar">
                <ProjectView :class="style.sidebarItem"></ProjectView>
                <PropertyView :class="style.sidebarItem"></PropertyView>
            </div>
            <div :class="style.viewportContainer">
                <MaterialEditor v-if="context" :data-content="context"></MaterialEditor>
                <OKCancel ref="_selectionController"></OKCancel>
                <LayoutViewport :app="application" :class="style.viewport"></LayoutViewport>
            </div>
        </div>
        <Statusbar :class="style.statusbar"></Statusbar>
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
import style from '../../styles/editor.module.css';

const application = inject<IApplication>('application')!;
const tabs = inject<RibbonTab[]>('tabs')!;

const ribbonTabs = computed(() => {
    return tabs.map(RibbonTabData.fromProfile);
})

const quickCommands: CommandKeys[] = ["doc.save", "doc.saveToFile", "edit.undo", "edit.redo"];

const registerRibbonCommand = (tabName: I18nKeys, groupName: I18nKeys, command: CommandKeys | Button) => {
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