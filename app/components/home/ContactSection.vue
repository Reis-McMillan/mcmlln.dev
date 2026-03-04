<template>
  <section
    id="contact"
    ref="sectionRef"
    class="flex min-h-[300px] flex-col items-center justify-center overflow-hidden p-6 font-mono"
  >
    <!-- Typed Text -->
    <div class="relative mb-8 flex h-16 items-center justify-center">
      <span class="text-4xl font-bold text-neutral-200 md:text-5xl">
        {{ displayedText }}
      </span>
      <span
        v-if="hasTriggered"
        class="ml-0.5 inline-block h-10 w-5 bg-current text-neutral-200 md:h-12 md:w-6"
      ></span>
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
        href="mailto:reismcmillan19@gmail.com"
        class="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-green-500/50 hover:bg-gray-700 hover:text-white"
      >
        <Icon name="mdi:email-outline" size="20" />
      </a>
    </div>
  </section>
</template>

<script setup>
const sectionRef = ref(null);
const displayedText = ref("");
const showButtons = ref(false);
const hasTriggered = ref(false);

const text = "Contact Me?";
const typeSpeed = 150;

function triggerAnimation() {
  if (hasTriggered.value) return;
  hasTriggered.value = true;

  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      displayedText.value += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      showButtons.value = true;
    }
  }, typeSpeed);
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
