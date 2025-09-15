<template>
    <div class="container">
        <div v-for="snapType in SnapTypes">
            <input type="checkbox" :id="`snap-${snapType.type}`"
                :checked="ObjectSnapType.has(Config.instance.snapType, snapType.type)"
                @click="handleSnapClick(snapType.type)"></input>
            <label :htmlFor="`snap-${snapType.type}`" v-i18n="{ i18nKey: snapType.display }"></label>
        </div>
        <input type="checkbox" id="snap-tracking" :checked="Config.instance.enableSnapTracking"
            @click="Config.instance.enableSnapTracking = !Config.instance.enableSnapTracking">
        <label htmlFor="snap-tracking" v-i18n="{ i18nKey: 'statusBar.tracking' }"></label>
    </div>
</template>

<script setup lang="ts">
import type { I18nKeys } from 'light-core';
import { Config, ObjectSnapType } from 'light-core';

const init = () => {
    Config.instance.onPropertyChanged(snapTypeChanged);
}

const snapTypeChanged = (property: keyof Config) => {
    if (property === "snapType" || property === "enableSnap" || property === "enableSnapTracking") {
        // todo

        // this.innerHTML = "";
        // this.render();
    }
};

const handleSnapClick = (snapType: ObjectSnapType) => {
    if (ObjectSnapType.has(Config.instance.snapType, snapType)) {
        Config.instance.snapType = ObjectSnapType.remove(Config.instance.snapType, snapType);
    } else {
        Config.instance.snapType = ObjectSnapType.add(Config.instance.snapType, snapType);
    }
}

const SnapTypes: Array<{
    type: ObjectSnapType;
    display: I18nKeys;
}> = [
        {
            type: ObjectSnapType.endPoint,
            display: "snap.end",
        },
        {
            type: ObjectSnapType.midPoint,
            display: "snap.mid",
        },
        {
            type: ObjectSnapType.center,
            display: "snap.center",
        },
        {
            type: ObjectSnapType.perpendicular,
            display: "snap.perpendicular",
        },
        {
            type: ObjectSnapType.intersection,
            display: "snap.intersection",
        },
    ];

init()
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    color: var(--foreground-color);

    div {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        user-select: none;

        input {
            width: 12px;
            height: 12px;
        }

        label {
            color: var(--foreground-color);
            font-size: 12px;
        }
    }
}
</style>