<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
    <div
      v-for="skill in skills"
      :key="skill.name"
      class="group rounded border border-gray-800 bg-gray-900/50 p-3 text-center transition-all hover:border-green-500/50"
    >
      <Icon
        v-if="skill.icon"
        :name="skill.icon"
        class="mx-auto mb-2 text-gray-500 transition-colors group-hover:text-green-400"
        :size="20"
      />
      <div class="text-xs text-gray-300">{{ skill.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Skill {
  name: string;
  icon: string;
}

interface Props {
  skills: Skill[];
}

defineProps<Props>();
</script>
