<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconClassName" />
    <title>{{ title }}</title>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.iconName}`;
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  vertical-align: -2px;
  color: inherit;
  fill: currentColor;
}
</style>
