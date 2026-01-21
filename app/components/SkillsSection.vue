<template>
  <section
    id="skills"
    class="jelly-section space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
  >
    <h2 class="flex text-2xl font-bold">
      <span class="mr-2">></span>
      Skills
    </h2>
    <div
      v-for="(category, cIndex) in skillCategories"
      :key="category.title"
      class="space-y-4"
      :style="{ '--c-delay': cIndex }"
    >
      <h3
        class="border-b border-gray-800 pb-2 text-sm tracking-widest text-gray-500 uppercase"
      >
        {{ category.title }}
      </h3>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="(skill, sIndex) in category.skills"
          :key="skill.name"
          class="skill-card group w-36 rounded border border-gray-800 bg-gray-900/50 p-3 text-center transition-all hover:scale-105 hover:border-green-500/50 hover:bg-gray-800/70"
          :style="{ '--s-delay': sIndex }"
        >
          <Icon
            v-if="skill.icon"
            :name="skill.icon"
            class="mb-2 text-gray-500 transition-all group-hover:text-green-400 group-hover:brightness-125"
            size="24"
          />
          <div class="text-xs text-gray-300">{{ skill.name }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const skillCategories = [
  {
    title: "Data Analytics & Machine Learning",
    skills: [
      { name: "Python", icon: "logos:python" },
      { name: "TensorFlow", icon: "logos:tensorflow" },
      { name: "PyTorch", icon: "logos:pytorch-icon" },
      { name: "PySpark", icon: "logos:apache-spark" },
      { name: "Scikit-Learn", icon: "devicon:scikitlearn" },
      { name: "Pandas", icon: "logos:pandas-icon" },
      { name: "Snowflake", icon: "logos:snowflake-icon" },
      { name: "R", icon: "logos:r-lang" },
      { name: "ROCm", icon: "logos:amd" },
    ],
  },
  {
    title: "Cloud Infrastructure & Deployment",
    skills: [
      { name: "Google Cloud", icon: "logos:google-cloud" },
      { name: "Azure", icon: "logos:microsoft-azure" },
      { name: "Ansible", icon: "mdi:ansible" },
      { name: "Docker", icon: "logos:docker-icon" },
      { name: "Bash", icon: "logos:bash-icon" },
      { name: "Git", icon: "logos:git-icon" },
    ],
  },
  {
    title: "Software & Web Development",
    skills: [
      { name: "Node.js", icon: "logos:nodejs-icon" },
      { name: "Express.js", icon: "skill-icons:expressjs-light" },
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "JavaScript", icon: "logos:javascript" },
      { name: "Java", icon: "logos:java" },
      { name: "Nuxt", icon: "logos:nuxt" },
    ],
  },
];
</script>
