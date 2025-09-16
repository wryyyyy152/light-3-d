<template>
    <div :class="style.panel">
        <template v-for="(material, index) in materials">
            <div :class="style.material">
                <div>
                    <span v-i18n="{ i18nKey: 'common.material' }"></span>
                    <span v-if="materials.length > 1">{{ ` ${index + 1}` }}</span>
                </div>
                <button @click="handelbuttobClick($event, material,index)" :style="{
                    backgroundColor: getBackgroundColor(material.color),
                    backgroundImage: getBackgroundImage(material.map.image),
                    backgroundBlendMode: 'multiply',
                    backgroundSize: 'cover',
                    cursor: 'pointer',
                }">
                    {{ material.name }}
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ColorConverter, UrlStringConverter } from 'light-controls';
import type { IDocument, Property, } from 'light-core';
import { Material, ObservableCollection, PubSub, Transaction } from 'light-core';
import style from '../../styles/materialProperty.module.css';

const props = defineProps<{
    document: IDocument,
    objects: any[],
    property: Property,
}>();

const materialCollection = (id: string | string[]) => {
    const findMaterial = (id: string) => props.document.materials.find((m) => m.id === id);
    const materials = Array.isArray(id)
        ? id.map(findMaterial).filter(Boolean)
        : [findMaterial(id)].filter(Boolean);
    return new ObservableCollection(...materials) as ObservableCollection<Material>;
}

const materials = materialCollection(props.objects[0].materialId)

const getBackgroundColor = (v: any): string => {
    return new ColorConverter().convert(v).value || ''
}
const getBackgroundImage = (v: any): string => {
    return new UrlStringConverter().convert(v).value || ''
}

const handelbuttobClick = (e: MouseEvent, material: Material,index:number) => {
    PubSub.default.pub("editMaterial", props.document, material, (material) => {
        setMaterial(e, material, index);
    });
}

const setMaterial = (e: MouseEvent, material: Material, index: number) => {
    Transaction.execute(props.document, "change material", () => {
        materials.replace(index, material);
        props.objects.forEach((x) => {
            if (props.property.name in x) {
                x.materialId =
                    materials.length > 1
                        ? x.materialId.toSpliced(index, 1, material.id)
                        : material.id;
            }
        });
    });
    props.document.visual.update();
}
</script>