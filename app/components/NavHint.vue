<script setup lang="ts">
const isNavActive = useState("orbital-nav-active", () => false);
const asymptoteDone = useState("asymptote-done", () => false);
const route = useRoute();
const hasRevealedNav = ref(false);

watch(isNavActive, (active) => {
  if (active) hasRevealedNav.value = true;
});

const showHint = computed(() => {
  if (isNavActive.value || hasRevealedNav.value) return false;
  // On home, wait for the dot-background morph-1 (asymptote) intro to finish.
  if (route.path === "/" && !asymptoteDone.value) return false;
  return true;
});
</script>

<template>
  <div class="nav-hint" :class="{ 'is-hidden': !showHint }" aria-hidden="true">
    <Icon name="lucide:chevrons-up" size="14" />
    <span class="nav-hint-text">Nav</span>
  </div>
</template>

<style scoped>
.nav-hint {
  position: fixed;
  top: 1.5%;
  left: 50%;
  z-index: 44;
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 11px;
  color: #587b7f;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  pointer-events: none;
  transition: opacity 320ms ease-out;
  animation: nav-hint-bounce 2.4s ease-in-out infinite;
}

.nav-hint.is-hidden {
  opacity: 0;
}

@keyframes nav-hint-bounce {
  0%,
  100% {
    transform: translate(-50%, 0);
  }

  50% {
    transform: translate(-50%, -4px);
  }
}
</style>
