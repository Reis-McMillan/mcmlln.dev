<template>
  <section
    id="projects"
    class="jelly-section space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
  >
    <h2 class="flex text-2xl font-bold">
      <span class="mr-2">></span>
      Featured Work
    </h2>
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
          project.github
            ? 'cursor-pointer hover:border-green-500/50 hover:bg-gray-800/50'
            : '',
        ]"
      >
        <div class="flex items-start justify-between">
          <h3
            class="text-xl font-bold transition-colors group-hover:text-green-400"
          >
            {{ project.title }}
          </h3>
          <Icon
            v-if="project.github"
            name="lucide:external-link"
            class="text-gray-600 group-hover:text-green-400"
            size="18"
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
  </section>
</template>

<script setup>
const projects = [
  {
    title: "Modernizing Fracdiff Python Package",
    description:
      "Brought an out-dated fractional differencing python package up-to-date, implementing a modern build system " +
      "with support for newer Python versions.",
    tech: ["Python", "GitHub Actions", "Scikit-Learn", "PyTorch"],
    github: "https://github.com/Reis-McMillan/fracdiff-modern",
  },
  {
    title: "Installing Arch Linux",
    description:
      "Yea, I'll admit it... I use Arch. I removed the original Windows OS on my HP Envy x360 2-in-1, and installed " +
      "Arch instead. I even enabled facial recognition and tablet mode for the new OS. Haven't looked back since.",
    tech: ["System Management", "UEFI Firmawre", "Hardware Interfacing"],
  },
];
</script>
