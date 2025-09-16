<template>
    <div ref="rootRef" :class="style.root">
        <div :class="style.actsContainer" :style="{ display: hide ? 'none' : 'flex' }">
            <div :class="style.border" @pointerdown="(ev) => ev.stopPropagation()" @click="(ev) => ev.stopPropagation()">
                <div :class="style.acts">
                    <template v-for="act in props.view.document.acts">
                        <div @click="handleActClick(act)">
                            <span>{{ act.name }}</span>
                            <div :class="style.tools">
                                <SvgIcon icon-name="icon-cog" @click="setActName(act)"></SvgIcon>
                                <SvgIcon icon-name="icon-times" @click="props.view.document.acts.remove(act)"></SvgIcon>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div v-if="props.showViewControls" :class="style.viewControls" @pointerdown="(ev) => ev.stopPropagation()"
            @click="(ev) => ev.stopPropagation()">
            <div :class="style.border">
                <div :class="{[style.actived]:props.view.cameraController.cameraType==='orthographic'}">
                    <SvgIcon icon-name="icon-orthographic" @click="handleCameraClick($event, 'orthographic')"></SvgIcon>
                </div>
                <div :class="{[style.actived]:props.view.cameraController.cameraType==='perspective'}">
                    <SvgIcon icon-name="icon-perspective" @click="handleCameraClick($event, 'perspective')"></SvgIcon>
                </div>
            </div>
            <div :class="style.border">
                <SvgIcon icon-name="icon-fitcontent" @click="handleFitcontent($event)"></SvgIcon>
                <SvgIcon icon-name="icon-zoomin" @click="handleZoomin()"></SvgIcon>
                <SvgIcon icon-name="icon-zoomout" @click="handleZoomout()"></SvgIcon>
            </div>
        </div>
        <Flyout ref="flyOutRef"></Flyout>
    </div>
</template>

<script setup lang="ts">
import { div, input, label } from 'light-controls';
import type { CameraType, IView } from 'light-core';
import { Act, DialogResult, I18n, PubSub } from 'light-core';
import { nextTick, onMounted, onUnmounted, ref, toRaw } from 'vue';
import style from '../../styles/viewport.module.css';
import SvgIcon from '../common/SvgIcon.vue';
import Flyout from './flyout/index.vue';

const props = defineProps<{
    view: IView,
    showViewControls: boolean
}>();
const _eventCaches: [keyof HTMLElementEventMap, (e: any) => void][] = []
const rootRef = ref<HTMLDivElement>();
onMounted(() => {
    nextTick(() => {
        if (rootRef.value) {
            const _view = toRaw(props.view)
            _view.setDom(rootRef.value);

            initEvent()
        }
    })

    props.view.document.acts.onCollectionChanged(onActCollectionChanged);
    onActCollectionChanged();
})
onUnmounted(() => {
    removeEvents();
    props.view.document.acts.removeCollectionChanged(onActCollectionChanged);
})

const removeEvents = () => {
    _eventCaches.forEach((x) => {
        removeEventListener(x[0], x[1]);
    });
    _eventCaches.length = 0;
}

const initEvent = () => {
    let events: [keyof HTMLElementEventMap, (view: IView, e: any) => any][] = [
        ["pointerdown", pointerDown],
        ["pointermove", pointerMove],
        ["pointerout", pointerOut],
        ["pointerup", pointerUp],
        ["wheel", mouseWheel],
    ];
    events.forEach((v) => {
        addEventListenerHandler(v[0], v[1]);
    });
}

const addEventListenerHandler = (type: keyof HTMLElementEventMap, handler: (view: IView, e: any) => any) => {
    let listener = (e: any) => {
        e.preventDefault();
        handler(props.view, e);
    };
    rootRef.value?.addEventListener(type, listener);
    _eventCaches.push([type, listener]);
}

const handleActClick = (act: Act) => {
    props.view.cameraController.lookAt(
        act.cameraPosition,
        act.cameraTarget,
        act.cameraUp,
    );
    props.view.update();
}

const setActName = (act: Act) => {
    const inputBox = input({
        value: act.name,
        onkeydown: (e) => {
            e.stopPropagation();
        },
    });
    PubSub.default.pub(
        "showDialog",
        "ribbon.group.act",
        div(label({ textContent: I18n.translate("common.name") }), ": ", inputBox),
        (result) => {
            if (result === DialogResult.ok) {
                act.name = inputBox.value;
            }
        },
    );
};

const handleCameraClick = (e: Event, cameraType: CameraType) => {
    e.stopPropagation();
    props.view.cameraController.cameraType = cameraType;
    props.view.update();
}

const handleFitcontent = (e: Event) => {
    e.stopPropagation();
    props.view.cameraController.fitContent();
    props.view.update();
}
const handleZoomin = () => {
    props.view.cameraController.zoom(props.view.width / 2, props.view.height / 2, -5);
    props.view.update();
}
const handleZoomout = () => {
    props.view.cameraController.zoom(props.view.width / 2, props.view.height / 2, 5);
    props.view.update();
}

const hide = ref<boolean>(true)
const onActCollectionChanged = () => {
    if (props.view.document.acts.length === 0) {
        hide.value = true
    } else {
        hide.value = false
    }
};

const flyOutRef = ref<InstanceType<typeof Flyout> | undefined>(undefined)
const pointerMove = (view: IView, event: PointerEvent) => {
    if (flyOutRef.value) {
        flyOutRef.value.$el.style.top = event.offsetY + "px";
        flyOutRef.value.$el.style.left = event.offsetX + "px";
    }
    view.document.visual.eventHandler.pointerMove(view, event);
    view.document.visual.viewHandler.pointerMove(view, event);
};

const pointerDown = (view: IView, event: PointerEvent) => {
    view.document.application.activeView = view;
    view.document.visual.eventHandler.pointerDown(view, event);
    view.document.visual.viewHandler.pointerDown(view, event);
};

const pointerUp = (view: IView, event: PointerEvent) => {
    view.document.visual.eventHandler.pointerUp(view, event);
    view.document.visual.viewHandler.pointerUp(view, event);
};

const pointerOut = (view: IView, event: PointerEvent) => {
    view.document.visual.eventHandler.pointerOut?.(view, event);
    view.document.visual.viewHandler.pointerOut?.(view, event);
};

const mouseWheel = (view: IView, event: WheelEvent) => {
    view.document.visual.eventHandler.mouseWheel?.(view, event);
    view.document.visual.viewHandler.mouseWheel?.(view, event);
};
</script>