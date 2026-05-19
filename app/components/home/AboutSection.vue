<script setup lang="ts">
import gsap from "gsap";

const WORDS: { text: string; bold?: boolean }[][] = [
  [{ text: "I" }],
  [{ text: "DESIGN", bold: true }, { text: "," }],
  [{ text: "BUILD", bold: true }, { text: "," }],
  [{ text: "and " }, { text: "IMPLEMENT", bold: true }],
  [{ text: "across" }],
  [{ text: "the" }],
  [{ text: "AI" }],
  [{ text: "stack." }],
];
const WORDS_2: { text: string; bold?: boolean }[][] = [
  [{ text: "These" }],
  [{ text: "are" }],
  [{ text: "the " }, { text: "TOOLS", bold: true }],
  [{ text: "that" }],
  [{ text: "POWER", bold: true }],
  [{ text: "it all." }],
];
const RANDOM_OFFSET_RANGE = 80;

const wordRefs = ref<HTMLElement[]>([]);
const wordRefs2 = ref<HTMLElement[]>([]);
const titleBlock = ref<HTMLElement | null>(null);
const scrollHintEl = ref<HTMLElement | null>(null);
let revealTimeline: gsap.core.Timeline | null = null;

const TITLE_FADE_DURATION = 0.6;

const asymptoteDone = useState("asymptote-done", () => false);
let stopAsymptoteWatch: (() => void) | null = null;

const { stop: stopLenis, start: startLenis } = useLenis();

function startReveal() {
  stopLenis();
  gsap.to([titleBlock.value, scrollHintEl.value], {
    autoAlpha: 1,
    duration: 0.5,
    onComplete: () => startLenis(),
  });

  revealTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: document.documentElement,
      start: "0% top",
      end: "8% top",
      scrub: 1,
    },
  });
  const W1 = wordRefs.value.length;
  const W2 = wordRefs2.value.length;
  // First stack fully exits at this t (mirrors how its fade-out is laid out).
  const STACK_1_END = TITLE_FADE_DURATION + 3 * W1 * 0.3;
  revealTimeline
    .to(
      [titleBlock.value, scrollHintEl.value],
      { autoAlpha: 0, duration: TITLE_FADE_DURATION },
      0
    )
    .to(
      wordRefs.value,
      { autoAlpha: 1, duration: 0.3, stagger: 0.3 },
      TITLE_FADE_DURATION
    )
    .to(
      wordRefs.value,
      { autoAlpha: 0, duration: 0.3, stagger: 0.3 },
      TITLE_FADE_DURATION + 2 * W1 * 0.3
    )
    .to(
      wordRefs2.value,
      { autoAlpha: 1, duration: 0.3, stagger: 0.3 },
      STACK_1_END
    )
    .to(
      wordRefs2.value,
      { autoAlpha: 0, duration: 0.3, stagger: 0.3 },
      STACK_1_END + 2 * W2 * 0.3
    );
}

onMounted(() => {
  if (import.meta.server) return;
  if (wordRefs.value.length === 0) return;

  stopLenis();

  wordRefs.value.forEach((el) => {
    const x = (Math.random() - 0.5) * RANDOM_OFFSET_RANGE;
    gsap.set(el, { x, autoAlpha: 0 });
  });
  wordRefs2.value.forEach((el) => {
    const x = (Math.random() - 0.5) * RANDOM_OFFSET_RANGE;
    gsap.set(el, { x, autoAlpha: 0 });
  });

  gsap.set([titleBlock.value, scrollHintEl.value], { autoAlpha: 0 });

  if (asymptoteDone.value) {
    startReveal();
  } else {
    stopAsymptoteWatch = watch(asymptoteDone, (done) => {
      if (done) {
        stopAsymptoteWatch?.();
        stopAsymptoteWatch = null;
        startReveal();
      }
    });
  }
});

onBeforeUnmount(() => {
  stopAsymptoteWatch?.();
  stopAsymptoteWatch = null;
  if (revealTimeline) {
    revealTimeline.scrollTrigger?.kill();
    revealTimeline.kill();
    revealTimeline = null;
  }
});
</script>

<template>
  <section id="about" class="pointer-events-none fixed inset-0 z-10">
    <div
      ref="titleBlock"
      class="pointer-events-none absolute inset-y-0 left-0 flex w-full flex-col items-center justify-center px-16 sm:w-2/3 sm:px-0"
    >
      <div class="glass-pane flex flex-col items-center text-center">
        <h2
          class="text-6xl font-bold tracking-tight text-[#F2F4F3] sm:text-7xl"
        >
          Reis McMillan
        </h2>
        <p
          class="mt-4 text-base tracking-[0.3em] text-[#DD6031] uppercase sm:text-lg"
        >
          AI · ML · HPC
        </p>
      </div>
    </div>
    <div ref="scrollHintEl" class="scroll-hint glass-pane">
      <span class="scroll-hint-label">Scroll down</span>
      <div class="scroll-track">
        <div class="scroll-dot" />
      </div>
    </div>
    <div
      class="pointer-events-auto absolute inset-y-0 left-0 flex w-full flex-col items-center justify-center gap-3 sm:w-2/3"
    >
      <span
        v-for="(parts, i) in WORDS"
        :key="i"
        ref="wordRefs"
        class="text-3xl text-[#F2F4F3] opacity-0"
      >
        <span
          v-for="(part, j) in parts"
          :key="j"
          :class="part.bold ? 'font-bold text-[#DD6031]' : 'font-thin'"
        >
          {{ part.text }}
        </span>
      </span>
    </div>
    <div
      class="pointer-events-auto absolute inset-y-0 left-0 flex w-full flex-col items-center justify-center gap-3 sm:w-2/3"
    >
      <span
        v-for="(parts, i) in WORDS_2"
        :key="i"
        ref="wordRefs2"
        class="text-3xl text-[#F2F4F3] opacity-0"
      >
        <span
          v-for="(part, j) in parts"
          :key="j"
          :class="part.bold ? 'font-bold text-[#DD6031]' : 'font-thin'"
        >
          {{ part.text }}
        </span>
      </span>
    </div>
  </section>
</template>

<style scoped>
.scroll-hint {
  position: absolute;
  bottom: 48px;
  left: 50%;
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 10px 22px;
  border-radius: 999px;
  transform: translateX(-50%);
}

.scroll-hint-label {
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 11px;
  color: #587b7f;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.scroll-track {
  position: relative;
  width: 2px;
  height: 24px;
  background: rgb(88 123 127 / 35%);
  border-radius: 1px;
}

.scroll-dot {
  position: absolute;
  left: 50%;
  width: 6px;
  height: 6px;
  background: #dd6031;
  border-radius: 50%;
  box-shadow: 0 0 6px rgb(221 96 49 / 60%);
  transform: translateX(-50%);
  animation: scroll-dot-bounce 2.4s infinite;
}

@keyframes scroll-dot-bounce {
  0% {
    top: -3px;
    opacity: 0;
  }

  8% {
    top: -3px;
    opacity: 1;
    animation-timing-function: cubic-bezier(0.4, 0, 1, 0.6);
  }

  35% {
    top: calc(100% - 3px);
    animation-timing-function: cubic-bezier(0, 0.4, 0.6, 1);
  }

  46% {
    top: 50%;
    animation-timing-function: cubic-bezier(0.4, 0, 1, 0.6);
  }

  60% {
    top: calc(100% - 3px);
    animation-timing-function: cubic-bezier(0, 0.4, 0.6, 1);
  }

  68% {
    top: 75%;
    animation-timing-function: cubic-bezier(0.4, 0, 1, 0.6);
  }

  80% {
    top: calc(100% - 3px);
    opacity: 1;
  }

  100% {
    top: calc(100% - 3px);
    opacity: 0;
  }
}
</style>
