<template>
  <div>
    <TerminalHeader @finished="isTyped = true" />
    
    <main v-if="isTyped" class="page-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isTyped = ref(false)
</script>