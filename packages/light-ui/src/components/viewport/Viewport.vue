<template>
    <div ref="rootRef" class="root">
        <div class="actsContainer" :style="{ display: hide ? 'none' : 'flex' }">
            <div class="border" @pointerdown="(ev) => ev.stopPropagation()" @click="(ev) => ev.stopPropagation()">
                <div class="acts">
                    <template v-for="act in props.view.document.acts">
                        <div @click="handleActClick(act)">
                            <span>{{ act.name }}</span>
                            <div class="tools">
                                <SvgIcon icon-name="icon-cog" @click="setActName(act)"></SvgIcon>
                                <SvgIcon icon-name="icon-times" @click="props.view.document.acts.remove(act)"></SvgIcon>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div v-if="props.showViewControls" class="viewControls" @pointerdown="(ev) => ev.stopPropagation()"
            @click="(ev) => ev.stopPropagation()">
            <div class="border">
                <div :class="getCameraControlClass('orthographic', props.view.cameraController.cameraType)">
                    <SvgIcon icon-name="icon-orthographic" @click="handleCameraClick($event, 'orthographic')"></SvgIcon>
                </div>
                <div :class="getCameraControlClass('perspective', props.view.cameraController.cameraType)">
                    <SvgIcon icon-name="icon-perspective" @click="handleCameraClick($event, 'perspective')"></SvgIcon>
                </div>
            </div>
            <div class="border">
                <SvgIcon icon-name="icon-fitcontent" @click="handleFitcontent($event)"></SvgIcon>
                <SvgIcon icon-name="icon-zoomin" @click="handleZoomin()"></SvgIcon>
                <SvgIcon icon-name="icon-zoomout" @click="handleZoomout()"></SvgIcon>
            </div>
        </div>
        <Flyout ref="flyOutRef"></Flyout>
    </div>
</template>

<script setup lang="ts">
import type { CameraType, IView } from 'light-core';
import { Act } from 'light-core';
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import SvgIcon from '../common/SvgIcon.vue';
import type Viewport from './Viewport.vue';
import Flyout from './flyout/index.vue';

const props = defineProps<{
    view: IView,
    showViewControls: boolean
}>();
const _eventCaches: [keyof HTMLElementEventMap, (e: any) => void][] = []
onMounted(() => {
    // dom
    const instance = getCurrentInstance() as InstanceType<typeof Viewport> | null;
    const dom = instance?.$el
    props.view.setDom(dom);
    // init event
    initEvent()

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

const rootRef = ref<HTMLDivElement | null>(null);
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
    // todo
    // const inputBox = input({
    //     value: act.name,
    //     onkeydown: (e) => {
    //         e.stopPropagation();
    //     },
    // });
    // PubSub.default.pub(
    //     "showDialog",
    //     "ribbon.group.act",
    //     div(label({ textContent: new Localize("common.name") }), ": ", inputBox),
    //     (result) => {
    //         if (result === DialogResult.ok) {
    //             act.name = inputBox.value;
    //         }
    //     },
    // );
};

const getCameraControlClass = (cameraType: CameraType, convertedCameraType: CameraType) => {
    if (cameraType === convertedCameraType) return 'actived'
    return ''
}

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

<style lang="scss" scoped>
.root {
    position: relative;
}

.actsContainer {
    position: absolute;
    bottom: 12px;
    z-index: 99999;
    width: 100%;
    pointer-events: all;

    .border {
        display: inline-block;
        position: relative;
        margin: auto;
        width: fit-content;
        max-width: 75%;

        &::before {
            position: absolute;
            bottom: 0;
            left: 1px;
            height: 50px;
            width: calc(100% - 2px);
            margin-top: 40px;
            content: "";
            border-radius: 16px;
            border: 1px solid var(--border-color);
            background-color: var(--panel-background-color);
            backdrop-filter: blur(10px);
        }

        .acts {
            display: flex;
            align-items: center;
            flex-direction: row;
            gap: 6px;
            cursor: pointer;
            height: 96px;
            margin: 0px 8px;
            overflow-y: hidden;
            overflow-x: auto;
            pointer-events: all;
            --floatControlVisible: none;

            &::-webkit-scrollbar {
                height: 6px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: var(--foreground-muted-color);
                border-radius: 3px;
            }

            &::-webkit-scrollbar-track {
                background-color: transparent;
            }

            div {
                position: relative;
                flex: 0 0 auto;
                padding: 8px;
                margin-top: 43px;
                width: 72px;
                border-radius: 8px;
                user-select: none;
                background-color: var(--panel-background-color);
                border: 1px solid var(--border-color);
                color: var(--foreground-color);
                font-size: 14px;
                justify-content: center;
                opacity: 0.75;
                height: 18px;

                span {
                    display: block;
                    max-width: 64px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    text-align: center;
                }

                &:hover {
                    opacity: 1;
                    --floatControlVisible: flex;
                }

                .tools {
                    display: var(--floatControlVisible);
                    background-color: transparent;
                    border: none;
                    position: absolute;
                    margin: 0;
                    padding: 8px;
                    top: -34px;
                    left: 0px;
                    gap: 4px;

                    svg {
                        width: 14px;
                        height: 14px;
                        padding: 4px;
                        border-radius: 100%;
                        background-color: var(--panel-background-color);
                        opacity: 0.75;

                        &:hover {
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }
}

.viewControls {
    position: absolute;
    height: 100%;
    top: 0;
    right: 16px;
    z-index: 999;
    pointer-events: none;
    padding-top: 160px;
    color: var(--foreground-color);

    svg {
        border: none;
        background: transparent;
        width: 22px;
        height: 22px;
        padding: 8px;
        border-radius: 7.5px;
        color: inherit;
        fill: currentColor;

        &:hover {
            background: var(--hover-background-color);
        }

        &:active {
            background: var(--active-background-color);
        }
    }

    .actived {
        background: var(--checked-color);
    }

    .border {
        border: 1px solid var(--border-color);
        background: var(--panel-background-color);
        border-radius: 10px;
        margin: 1px 0px;
        padding: 2px;
        pointer-events: all;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: var(--foreground-color);

        div {
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border-radius: 7.5px;
            color: inherit;
        }
    }
}

@media (max-width: 680px) {
    .viewControls {
        display: none;
    }
}
</style>