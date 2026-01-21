<template>
  <div>
    <TerminalHeader @finished="isTyped = true" />

    <main v-if="isTyped" class="page-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isTyped = ref(false);
const { init, destroy } = useLenis();

onMounted(() => {
  init();
});

onUnmounted(() => {
  destroy();
});
</script>
