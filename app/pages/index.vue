<template>
  <div ref="mainContainer" class="max-w-8xl mx-auto px-6 pb-6 relative">
    <AboutSection class="card-to-stack" @ready="initStacking" />
    <SkillsSection class="card-to-stack" />
    <ProjectsSection class="card-to-stack" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const mainContainer = ref(null)

const initStacking = () => {
  gsap.registerPlugin(ScrollTrigger)

  const cards = gsap.utils.toArray('.card-to-stack')
  
  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: () => `top ${24 + (i * 24)}px`,
      endTrigger: mainContainer.value,
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });

    const nextCard = cards[i + 1];
    if (nextCard) {
      gsap.to(card, {
        scrollTrigger: {
          trigger: nextCard,
          start: `top ${24 + (i * 24) + card.offsetHeight}px`,
          end: () => `top ${24 + (i * 24)}px`,
          scrub: true
        },
        height: '90px',
        overflow: "hidden",
      });
    }
  });
}
</script>

<style scoped>
.card-to-stack {
  margin-bottom: 32px; 
}

.max-w-8xl {
  padding-bottom: 50vh;
}
</style>