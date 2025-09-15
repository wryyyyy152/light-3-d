<script setup lang="ts">
import type { Button, CommandKeys, I18nKeys, IApplication, RibbonTab } from "light-core";
import { PubSub } from "light-core";
import { onMounted, provide, ref } from 'vue';
import Dialog from "./components/Dialog.vue";
import Permanent from "./components/Permanent.vue";
import Toast from "./components/Toast.vue";
import router from "./router";

const _inited = ref<boolean>(false)

const props = defineProps<{
  application: IApplication,
  tabs: RibbonTab[]
}>();

provide('application', props.application)
provide('tabs', props.tabs)

const init = () => {
  if (_inited.value) {
    throw new Error("MainWindow is already inited");
  }
  _inited.value = true;

  _initSubs(props.application);
}

const permanentRef = ref()
const toastRef = ref()
const dialogRef = ref()
const _initSubs = (application: IApplication) => {
  PubSub.default.sub("showToast", toastRef.value.info);
  PubSub.default.sub("displayError", toastRef.value.error);
  PubSub.default.sub("showDialog", dialogRef.value.show);
  PubSub.default.sub("showPermanent", permanentRef.value.show);
  PubSub.default.sub("activeViewChanged", (view) => displayHome(view === undefined));
  PubSub.default.sub("displayHome", (show) => displayHome(show));
}

const displayHome = (displayHome: boolean) => {
  if (displayHome) router.push('/home')
  else router.push('/editor')
}

const registerRibbonCommand = (tabName: I18nKeys, groupName: I18nKeys, command: CommandKeys | Button) => {
  PubSub.default.pub("registerRibbonCommand", tabName, groupName, command);
}

onMounted(() => {
  document.documentElement.setAttribute("theme", "light");
  document.oncontextmenu = (e) => e.preventDefault();
  document.body.addEventListener("scroll", () => {
    document.body.scrollTop = 0;
  });
})

defineExpose({
  init,
  registerRibbonCommand
})
</script>

<template>
  <!-- 一级路由出口组件 -->
  <RouterView />
  <Teleport to="body">
    <Permanent ref="permanentRef"></Permanent>
    <Toast ref="toastRef"></Toast>
    <Dialog ref="dialogRef"></Dialog>
  </Teleport>
</template>

<style scoped lang="scss">
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
