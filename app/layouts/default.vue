<template>
  <div>
    <TerminalHeader @finished="doneTyping" />

    <main v-if="isTyped" class="page-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const isTyped = shallowRef(false);

const doneTyping = () => {
  isTyped.value = true;
};
</script>
