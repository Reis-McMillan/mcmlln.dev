<template>
  <section 
    id="skills" 
    class="space-y-6 overflow-hidden bg-[#1a1a1a] border
     border-gray-800 rounded-xl p-6 shadow-2xl backdrop-blur-md"
  >
    <h2 class="text-2xl font-bold flex">
      <span class="mr-2">></span> Skills
    </h2>

    <TransitionGroup 
      name="category-slide" 
      tag="div" 
      appear
      class="space-y-12"
    >
      <div 
        v-for="(category, cIndex) in skillCategories" 
        :key="category.title" 
        class="space-y-4"
        :style="{ '--c-delay': cIndex }"
      >
        <h3 class="text-sm text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
          {{ category.title }}
        </h3>
        
        <TransitionGroup 
          name="skill-pop" 
          tag="div" 
          appear
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <div 
            v-for="(skill, sIndex) in category.skills" 
            :key="skill.name" 
            class="skill-card p-3 border border-gray-800 bg-gray-900/50 rounded hover:border-green-500/50 transition-all group text-center"
            :style="{ '--s-delay': sIndex }"
          >
            <Icon v-if="skill.icon" :name="skill.icon" class="mb-2 text-gray-500 group-hover:text-green-400 transition-colors" size="24" />
            <div class="text-xs text-gray-300">{{ skill.name }}</div>
          </div>
        </TransitionGroup>
      </div>
    </TransitionGroup>
  </section>
</template>

<style scoped>
/* 1. Category Slide: Slides down and fades in from the header point */
.category-slide-enter-active {
  transition: all 0.6s ease-out;
  transition-delay: calc(var(--c-delay) * 0.2s);
}
.category-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

/* 2. Skill Pop: Slides right and down from the top-left of the category */
.skill-pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy effect */
  /* This combines the category delay + the individual skill delay */
  transition-delay: calc((var(--c-delay) * 0.3s) + (var(--s-delay) * 0.05s));
}

.skill-pop-enter-from {
  opacity: 0;
  transform: translate(-30px, -10px) scale(0.9);
}

/* Optional: Smooth movement if items change order */
.skill-pop-move {
  transition: transform 0.4s ease;
}
</style>

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
      { name: "ROCm", icon: "logos:amd"}
    ]
  },
  {
    title: "Cloud Infrastructure & Deployment",
    skills: [
      { name: "Google Cloud", icon: "logos:google-cloud" },
      { name: "Azure", icon: "logos:microsoft-azure" },
      { name: "Ansible", icon: "mdi:ansible" },
      { name: "Docker", icon: "logos:docker-icon" },
      { name: "Bash", icon: "logos:bash-icon" },
      { name: "Git", icon: "logos:git-icon" } 
    ]
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
      { name: "Nuxt", icon: "logos:nuxt"}
    ]
  }
]
</script>