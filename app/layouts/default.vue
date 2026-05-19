<template>
  <div>
    <DotBackground v-if="showWave && route.path === '/'" />
    <Transition name="fade" mode="out-in" @after-leave="showWave = true">
      <TerminalLoader
        v-if="!isLoaded"
        key="loader"
        @finished="isLoaded = true"
      />
      <main v-else key="page" class="page-content">
        <slot />
      </main>
    </Transition>
    <div
      class="blur-overlay"
      :class="{ active: isNavActive }"
      aria-hidden="true"
    />
    <StatusBar v-if="isLoaded" />
    <SiteFooter v-if="isLoaded" />
    <NavHint v-if="isLoaded" />
    <OrbitalNav v-if="isLoaded" />
    <CustomScrollbar v-if="isLoaded" />
  </div>
</template>

<script setup lang="ts">
const isLoaded = ref(false);
const showWave = ref(false);
const route = useRoute();
const { init, destroy } = useLenis();
const isNavActive = useState("orbital-nav-active", () => false);

onMounted(() => {
  init();
});

onUnmounted(() => {
  destroy();
});
</script>

<style scoped>
.blur-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  backdrop-filter: blur(0);
  transition: backdrop-filter var(--duration-base) ease-out;
}

.blur-overlay.active {
  backdrop-filter: blur(6px);
}
</style>
