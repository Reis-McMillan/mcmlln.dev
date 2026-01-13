<template>
  <div class="mx-auto max-w-7xl px-6 py-12">
    <div ref="cardsContainer" class="cards-container">
      <SectionCard id="about" title="About Me">
        <AboutContent />
      </SectionCard>

      <SectionCard id="ml-skills" title="Data Analytics & Machine Learning">
        <SkillGrid :skills="skillsData.ml" />
      </SectionCard>

      <SectionCard id="cloud-skills" title="Cloud Infrastructure & Deployment">
        <SkillGrid :skills="skillsData.cloud" />
      </SectionCard>

      <SectionCard id="webdev-skills" title="Software & Web Development">
        <SkillGrid :skills="skillsData.webDev" />
      </SectionCard>

      <SectionCard id="projects" title="Featured Work">
        <ProjectGrid :projects="projects" />
      </SectionCard>
    </div>

    <div class="py-24 text-center text-6xl">🎉 You made it! 🎉</div>

    <EasterEgg />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Skills data organized by category
const skillsData = {
  ml: [
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
  cloud: [
    { name: "Google Cloud", icon: "logos:google-cloud" },
    { name: "Azure", icon: "logos:microsoft-azure" },
    { name: "Ansible", icon: "mdi:ansible" },
    { name: "Docker", icon: "logos:docker-icon" },
    { name: "Bash", icon: "logos:bash-icon" },
    { name: "Git", icon: "logos:git-icon" },
  ],
  webDev: [
    { name: "Node.js", icon: "logos:nodejs-icon" },
    { name: "Express.js", icon: "skill-icons:expressjs-light" },
    { name: "PostgreSQL", icon: "logos:postgresql" },
    { name: "MongoDB", icon: "logos:mongodb-icon" },
    { name: "JavaScript", icon: "logos:javascript" },
    { name: "Java", icon: "logos:java" },
    { name: "Nuxt", icon: "logos:nuxt" },
  ],
};

// Projects data
const projects = [
  {
    title: "Modernizing Fracdiff Python Package",
    description:
      "Brought an out-dated fractional differencing python package up-to-date, implementing a modern build system with support for newer Python versions.",
    tech: ["Python", "GitHub Actions", "Scikit-Learn", "PyTorch"],
    github: "https://github.com/Reis-McMillan/fracdiff-modern",
  },
  {
    title: "Installing Arch Linux",
    description:
      "Yea, I'll admit it... I use Arch. I removed the original Windows OS on my HP Envy x360 2-in-1, and installed Arch instead. I even enabled facial recognition and tablet mode for the new OS. Haven't looked back since.",
    tech: ["System Management", "UEFI Firmware", "Hardware Interfacing"],
  },
];

const cardsContainer = ref<HTMLElement>();

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger);

    // Wait for DOM to be ready
    setTimeout(() => {
      if (!cardsContainer.value) return;

      const cards = Array.from(cardsContainer.value.children) as HTMLElement[];
      const container = cardsContainer.value;

      // Pin the entire container at its original position (below header)
      // Header height: ~80px (1rem padding + 3rem font-size + 1rem padding)
      ScrollTrigger.create({
        trigger: container,
        start: "top 120px",
        end: "+=500vh",
        pin: true,
        pinSpacing: true,
        markers: true,
      });

      // Animate each card's height based on scroll progress
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return; // Skip last card

        ScrollTrigger.create({
          trigger: container,
          start: "top 120px",
          end: "+=500vh",
          onUpdate: (self) => {
            const progress = self.progress;
            const cardStart = index * 0.2; // Each card gets 20% of total scroll
            const cardEnd = (index + 1) * 0.2;

            if (progress >= cardStart && progress <= cardEnd) {
              const cardProgress = (progress - cardStart) / 0.2;
              const currentHeight = card.scrollHeight;
              const targetHeight = 88;
              const newHeight =
                currentHeight - (currentHeight - targetHeight) * cardProgress;
              card.style.height = `${newHeight}px`;
            } else if (progress > cardEnd) {
              card.style.height = "88px";
            }
          },
          markers: true,
        });
      });
    }, 100);
  }
});

useHead({
  title: "Home",
});
</script>
