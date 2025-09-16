<template>
  <svg :class="style.svgIcon" aria-hidden="true">
    <use :xlink:href="iconClassName" />
    <title>{{ title }}</title>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import style from '../../styles/icon.module.css';

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
