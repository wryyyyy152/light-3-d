<template>
    <div :class="style.root">
        <label :class="style.header" v-i18n="{ i18nKey: 'properties.header' }"></label>
        <div :class="style.panel">
            <div :class="style.properties">
                <template v-for="(control) in controls">
                    <component :is="control.component" v-bind="control.props" />
                </template>
            </div>
            <expander ref="transformRef" v-if="transformExp" :header="transformExp"></expander>
            <expander ref="parameterRef" v-if="parameterExp" :header="parameterExp"></expander>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys, IDocument, INode, IView } from 'light-core';
import { FolderNode, GroupNode, Property, PubSub, VisualNode } from 'light-core';
import { nextTick, onMounted, ref } from 'vue';
import style from '../../styles/propertyView.module.css';
import Expander from '../common/Expander.vue';
import type { controlType } from '../utils';
import MatrixProperty from './MatrixProperty.vue';
import { findPropertyControl } from './utils';

const handleShowProperties = (document: IDocument, nodes: INode[]) => {
    if (nodes.length === 0) return;
    addModel(document, nodes);
    addGeometry(nodes, document);
};

const handleActiveViewChanged = (view: IView | undefined) => {
    if (view) {
        let nodes = view.document.selection.getSelectedNodes();
        handleShowProperties(view.document, nodes);
    }
};

const controls = ref<Array<controlType>>([])
const addModel = (document: IDocument, nodes: INode[]) => {
    if (nodes.length === 0) return;

    if (nodes[0] instanceof FolderNode) {
        controls.value = Property.getProperties(Object.getPrototypeOf(nodes[0])).map((x) =>
            findPropertyControl(document, nodes, x),
        ).filter(x => x !== undefined);
    } else if (nodes[0] instanceof Node) {
        controls.value = Property.getOwnProperties(Node.prototype).map((x) =>
            findPropertyControl(document, nodes, x),
        ).filter(x => x !== undefined);
    }
}

const addGeometry = (nodes: INode[], document: IDocument) => {
    const geometries = nodes.filter((x) => x instanceof VisualNode || x instanceof GroupNode);
    if (geometries.length === 0 || !isAllElementsOfTypeFirstElement(geometries)) return;
    addTransform(document, geometries);
    addParameters(geometries, document);
}

const transformExp = ref<I18nKeys | undefined>(undefined)
const transformRef = ref<InstanceType<typeof Expander> | undefined>()
const addTransform = async (document: IDocument, geometries: (VisualNode | GroupNode)[]) => {
    // todo
    transformExp.value = 'common.matrix'

    await nextTick();
    // 使用transformRef：
    transformRef.value?.addItem([{
        component: MatrixProperty,
        props: {
            document,
            geometries,
            className: 'properties'
        }
    }])
}

const parameterExp = ref<I18nKeys | undefined>(undefined)
const parameterRef = ref<InstanceType<typeof Expander> | undefined>()
const addParameters = (geometries: (VisualNode | GroupNode)[], document: IDocument) => {
    const entities = geometries.filter((x) => x instanceof VisualNode);
    if (entities.length === 0 || !isAllElementsOfTypeFirstElement(entities)) return;

    parameterExp.value = entities[0].display()
    const c: controlType[] = Property.getProperties(Object.getPrototypeOf(entities[0]), Node.prototype).map((x) =>
        findPropertyControl(document, entities, x)
    ).filter(x => x !== undefined)
    parameterRef.value?.addItem(c)
}

const isAllElementsOfTypeFirstElement = (arr: any[]): boolean => {
    if (arr.length <= 1) {
        return true;
    }
    const firstElementType = Object.getPrototypeOf(arr[0]).constructor;
    for (let i = 1; i < arr.length; i++) {
        if (Object.getPrototypeOf(arr[i]).constructor !== firstElementType) {
            return false;
        }
    }
    return true;
}

onMounted(() => {
    PubSub.default.sub("showProperties", handleShowProperties);
    PubSub.default.sub("activeViewChanged", handleActiveViewChanged);
})
</script>