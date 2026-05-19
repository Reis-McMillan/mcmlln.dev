<script setup lang="ts">
import gsap from "gsap";

const headingRef = ref<HTMLElement | null>(null);
const linkRef = ref<HTMLElement | null>(null);

let revealTween: gsap.core.Tween | null = null;

onMounted(() => {
  if (import.meta.server) return;

  gsap.set([headingRef.value, linkRef.value], { y: 10, autoAlpha: 0 });

  revealTween = gsap.to([headingRef.value, linkRef.value], {
    y: 0,
    autoAlpha: 1,
    duration: 0.5,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: {
      trigger: document.documentElement,
      start: "85% top",
      toggleActions: "play none none reverse",
    },
  });
});

onBeforeUnmount(() => {
  revealTween?.scrollTrigger?.kill();
  revealTween?.kill();
  revealTween = null;
});
</script>

<template>
  <section
    class="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 px-6"
  >
    <h2
      ref="headingRef"
      class="text-center text-5xl font-thin tracking-tight text-[#F2F4F3] sm:text-6xl"
    >
      Want to reach out?
    </h2>
    <div ref="linkRef" class="pointer-events-auto">
      <NuxtLink
        to="/contact"
        class="glass-pane interactive contact-button inline-flex items-center gap-2 text-sm tracking-wider text-[#DD6031] uppercase"
        :style="{ '--tint-color': '#DD6031' }"
      >
        Get in touch
        <Icon name="lucide:arrow-right" size="16" />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.contact-button {
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
}
</style>
