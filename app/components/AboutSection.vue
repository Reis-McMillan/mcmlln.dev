<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

const emit = defineEmits(['ready'])

onMounted(() => {
  if (process.client) {
    gsap.registerPlugin(TextPlugin)
    
    const tl = gsap.timeline({
      // Refresh ScrollTrigger positions as the container expands
      onComplete: () => emit('ready')
    });

    tl.to(".paragraph1", {
      duration: 3,
      text: `As a Data Science, Statistics, and Mathematics student at Purdue University, 
             I engineer high-performance, data-driven applications at the intersection of 
             rigorous theory and scalable infrastructure. My technical interests center on 
             deep learning, reinforcement learning, and Bayesian methods, with a 
             professional focus on AI/ML engineering.`,
      ease: "none"
    })
    tl.to(".paragraph2", {
      duration: 2,
      text: `Currently, I am a Founding Engineer at Concrete Engine, where I lead a 
             team building the future of high-performance computing by designing 
             robust observability and data-handling systems.`,
      ease: "none"
    })
  }
})
</script>

<template>
  <section 
    id="about" 
    class="space-y-6 overflow-hidden bg-[#1a1a1a] border
     border-gray-800 rounded-xl p-6 shadow-2xl backdrop-blur-md"
  >
    <h2 class="text-2xl font-bold flex">
      <span class="mr-2">></span> About Me
    </h2>
    <div class="text-lg leading-relaxed text-gray-300">
      <p class="paragraph1"></p>
      <br>
      <p class="paragraph2"></p>
    </div>
  </section>
</template>