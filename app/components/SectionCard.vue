<template>
  <div
    :id="id"
    class="mb-8 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6"
  >
    <h2 class="mb-6 flex items-center gap-2 text-2xl font-bold">
      <span class="text-green-400">></span>
      <Icon v-if="icon" :name="icon" :size="20" />
      {{ title }}
    </h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  icon?: string;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  id: undefined,
});
</script>
