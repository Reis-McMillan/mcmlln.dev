<template>
  <div class="grid gap-6">
    <component
      :is="project.github ? 'a' : 'div'"
      v-for="project in projects"
      :key="project.title"
      :href="project.github"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        'group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all',
        project.github ? 'cursor-pointer hover:border-green-500/50 hover:bg-gray-800/50' : '',
      ]"
    >
      <div class="flex items-start justify-between">
        <h3 class="text-xl font-bold transition-colors group-hover:text-green-400">
          {{ project.title }}
        </h3>
        <Icon
          v-if="project.github"
          name="lucide:external-link"
          class="text-gray-600 group-hover:text-green-400"
          :size="16"
        />
      </div>

      <p class="mt-2 font-mono text-sm leading-relaxed text-gray-400">
        {{ project.description }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tech in project.tech"
          :key="tech"
          class="rounded border border-green-500/20 bg-green-500/10 px-2 py-1 font-mono text-[10px] tracking-wider text-green-400 uppercase"
        >
          {{ tech }}
        </span>
      </div>
    </component>
  </div>
</template>

<script setup lang="ts">
interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
}

interface Props {
  projects: Project[];
}

defineProps<Props>();
</script>
