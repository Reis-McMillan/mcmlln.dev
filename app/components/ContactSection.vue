<template>
  <section
    id="contact"
    ref="sectionRef"
    class="flex min-h-[300px] flex-col items-center justify-center overflow-hidden p-6 font-mono"
  >
    <!-- Rolling Letters -->
    <div class="relative mb-8 flex h-16 justify-center">
      <span
        v-for="(letter, i) in letters"
        :key="i"
        class="inline-block text-4xl font-bold transition-all duration-700 ease-out md:text-5xl"
        :class="letter.char === ' ' ? 'w-4' : ''"
        :style="{
          transform: isAnimating
            ? `translateX(${letter.startX}px) rotate(${letter.rotation}deg)`
            : 'translateX(0) rotate(0deg)',
          opacity: isAnimating ? 0 : 1,
          transitionDelay: `${letter.delay}ms`,
          color: letter.char === '?' ? '#00ff41' : '#e5e5e5',
        }"
      >
        {{ letter.char }}
      </span>
    </div>

    <!-- Contact Buttons -->
    <div
      class="flex gap-4 transition-all duration-500"
      :style="{
        opacity: showButtons ? 1 : 0,
        transform: showButtons ? 'translateY(0)' : 'translateY(20px)',
      }"
    >
      <a
        href="https://instagram.com/reism19"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-pink-500/50 hover:bg-gray-700 hover:text-white"
      >
        <Icon name="mdi:instagram" size="20" />
      </a>
      <a
        href="https://linkedin.com/in/reis-t-mcmillan"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-blue-500/50 hover:bg-gray-700 hover:text-white"
      >
        <Icon name="mdi:linkedin" size="20" />
      </a>
      <a
        href="mailto:reismcmillan@gmail.com"
        class="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-green-500/50 hover:bg-gray-700 hover:text-white"
      >
        <Icon name="mdi:email-outline" size="20" />
      </a>
    </div>
  </section>
</template>

<script setup>
const sectionRef = ref(null);
const isAnimating = ref(true);
const showButtons = ref(false);
const hasTriggered = ref(false);

const text = "Contact Me?";
const letters = text.split("").map((char, i, arr) => ({
  char,
  startX: -600 - (arr.length - 1 - i) * 30,
  rotation: -720 - (arr.length - 1 - i) * 45,
  delay: (arr.length - 1 - i) * 50,
}));

function triggerAnimation() {
  if (hasTriggered.value) return;
  hasTriggered.value = true;

  isAnimating.value = false;

  const totalDuration = letters.length * 50 + 700;
  setTimeout(() => {
    showButtons.value = true;
  }, totalDuration);
}

onMounted(() => {
  if (import.meta.server) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggerAnimation();
          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>
