<template>
  <section 
    id="projects" 
    class="space-y-6 overflow-hidden bg-[#1a1a1a] border
     border-gray-800 rounded-xl p-6 shadow-2xl backdrop-blur-md"
  >
    <h2 class="text-2xl font-bold flex">
      <span class="mr-2">></span> Featured Work
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
          'group p-6 border border-gray-800 bg-gray-900/50 rounded-lg transition-all',
          project.github ? 'hover:bg-gray-800/50 hover:border-green-500/50 cursor-pointer' : ''
        ]"
      >
        <div class="flex justify-between items-start">
          <h3 class="text-xl font-bold group-hover:text-green-400 transition-colors">
            {{ project.title }}
          </h3>
          <Icon v-if="project.github" name="lucide:external-link" class="text-gray-600 group-hover:text-green-400" size="18" />
        </div>

        <p class="mt-2 text-gray-400 font-mono text-sm leading-relaxed">
          {{ project.description }}
        </p>

        <div class="mt-4 flex gap-2 flex-wrap">
          <span v-for="tech in project.tech" :key="tech" 
                class="text-[10px] font-mono uppercase tracking-wider bg-green-500/10 border border-green-500/20 px-2 py-1 rounded text-green-400">
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
    description: "Brought an out-dated fractional differencing python package up-to-date, implementing a modern build system " +
                  "with support for newer Python versions.",
    tech: ["Python", "GitHub Actions", "Scikit-Learn", "PyTorch"],
    github: "https://github.com/Reis-McMillan/fracdiff-modern"
  },
  {
    title: "Installing Arch Linux",
    description: "Yea, I'll admit it... I use Arch. I removed the original Windows OS on my HP Envy x360 2-in-1, and installed "+
                  "Arch instead. I even enabled facial recognition and tablet mode for the new OS. Haven't looked back since.",
    tech: ["System Management", "UEFI Firmawre", "Hardware Interfacing"]
  },
]
</script>