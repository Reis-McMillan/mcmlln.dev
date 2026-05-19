<script lang="ts" setup>
const emit = defineEmits<{ finished: [] }>();

const NAME = "./reis ";
const TYPE_SPEED = 50;
const BAR_WIDTH = 30;
const STEPS = 1000;
const BAR_FILL_MS = 100;
const INIT_LINE_GAP_MS = 100;
const EPOCH_GAP_MS = 50;
const TRAILING_PAUSE_MS = 100;

interface EpochStats {
  loss: number;
  acc: number;
  valLoss: number;
  valAcc: number;
  wallS: number;
  stepMs: number;
}

const EPOCHS: EpochStats[] = [
  {
    loss: 0.6421,
    acc: 0.821,
    valLoss: 0.4102,
    valAcc: 0.8845,
    wallS: 42,
    stepMs: 28,
  },
  {
    loss: 0.2024,
    acc: 0.9405,
    valLoss: 0.2103,
    valAcc: 0.9387,
    wallS: 38,
    stepMs: 25,
  },
  {
    loss: 0.1098,
    acc: 0.9671,
    valLoss: 0.1554,
    valAcc: 0.9521,
    wallS: 35,
    stepMs: 23,
  },
  {
    loss: 0.0654,
    acc: 0.9802,
    valLoss: 0.1335,
    valAcc: 0.9603,
    wallS: 35,
    stepMs: 23,
  },
  {
    loss: 0.0345,
    acc: 0.9901,
    valLoss: 0.1238,
    valAcc: 0.9658,
    wallS: 35,
    stepMs: 23,
  },
];

const displayedText = ref("");
const lines = ref<string[]>([]);
const inProgressLine = ref("");
const showCursor = ref(true);
const loaderRoot = ref<HTMLElement | null>(null);

const outputText = computed(() => {
  const all = [...lines.value];
  if (inProgressLine.value) all.push(inProgressLine.value);
  return all.join("\n");
});

const timeouts = new Set<ReturnType<typeof setTimeout>>();
let rafId = 0;

function scheduleTimeout(fn: () => void, ms: number) {
  const id = setTimeout(() => {
    timeouts.delete(id);
    fn();
  }, ms);
  timeouts.add(id);
  return id;
}

function fmtTimestamp(d: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.` +
    `${pad(d.getMilliseconds(), 3)}`
  );
}

function fmtFloat(n: number): string {
  return n.toFixed(4);
}

function autoScrollToBottom() {
  void nextTick(() => {
    const el = loaderRoot.value;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  });
}

function appendLine(line: string) {
  lines.value.push(line);
  autoScrollToBottom();
}

function buildBar(filled: number): string {
  const safe = Math.max(0, Math.min(BAR_WIDTH, filled));
  if (safe === 0) return `[${" ".repeat(BAR_WIDTH)}]`;
  if (safe === BAR_WIDTH) return `[${"=".repeat(BAR_WIDTH)}]`;
  return `[${"=".repeat(safe - 1)}>${".".repeat(BAR_WIDTH - safe)}]`;
}

function buildFinalEpochLine(e: EpochStats): string {
  return (
    `${STEPS}/${STEPS} [${"=".repeat(BAR_WIDTH)}] - ${e.wallS}s ${e.stepMs}ms/step` +
    ` - loss: ${fmtFloat(e.loss)} - accuracy: ${fmtFloat(e.acc)}` +
    ` - val_loss: ${fmtFloat(e.valLoss)} - val_accuracy: ${fmtFloat(e.valAcc)}`
  );
}

function animateEpoch(idx: number, onDone: () => void) {
  const e = EPOCHS[idx]!;
  appendLine(`Epoch ${idx + 1}/${EPOCHS.length}`);

  const startTs = performance.now();
  const tick = (now: number) => {
    const elapsed = now - startTs;
    const ratio = Math.min(1, elapsed / BAR_FILL_MS);
    const cur = Math.floor(ratio * STEPS);
    const filled = Math.floor(ratio * BAR_WIDTH);
    const eta = Math.max(0, Math.ceil((1 - ratio) * e.wallS));
    inProgressLine.value = `${cur}/${STEPS} ${buildBar(filled)} - ETA: ${eta}s`;
    autoScrollToBottom();

    if (ratio < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      inProgressLine.value = "";
      appendLine(buildFinalEpochLine(e));
      scheduleTimeout(onDone, EPOCH_GAP_MS);
    }
  };
  rafId = requestAnimationFrame(tick);
}

function runEpochs(idx: number) {
  if (idx >= EPOCHS.length) {
    scheduleTimeout(() => {
      showCursor.value = false;
      emit("finished");
    }, TRAILING_PAUSE_MS);
    return;
  }
  animateEpoch(idx, () => runEpochs(idx + 1));
}

function buildInitLines(now: Date): string[] {
  const t1 = fmtTimestamp(now);
  const t2 = fmtTimestamp(new Date(now.getTime() + 3));
  return [
    `${t1} [I] Visible devices: [GPU:0, GPU:1, GPU:2, GPU:3, GPU:4]`,
    `${t2} [I] Using MirroredStrategy with devices ('/job:localhost/replica:0/task:0/device:GPU:0',`,
    `    '/job:localhost/replica:0/task:0/device:GPU:1', '/job:localhost/replica:0/task:0/device:GPU:2',`,
    `    '/job:localhost/replica:0/task:0/device:GPU:3', '/job:localhost/replica:0/task:0/device:GPU:4')`,
    `INFO:tensorflow:Using MirroredStrategy with 5 devices.`,
    `INFO:tensorflow:Number of devices: 5`,
  ];
}

function streamInitLines(then: () => void) {
  const initLines = buildInitLines(new Date());
  let i = 0;
  const next = () => {
    if (i >= initLines.length) {
      then();
      return;
    }
    appendLine(initLines[i]!);
    i++;
    scheduleTimeout(next, INIT_LINE_GAP_MS);
  };
  next();
}

function typeName(then: () => void) {
  let i = 0;
  const step = () => {
    if (i < NAME.length) {
      displayedText.value += NAME.charAt(i);
      i++;
      scheduleTimeout(step, TYPE_SPEED);
    } else {
      then();
    }
  };
  step();
}

function runFullAnimation() {
  typeName(() => streamInitLines(() => runEpochs(0)));
}

function runReducedMotion() {
  displayedText.value = NAME;
  lines.value = [
    ...buildInitLines(new Date()),
    ...EPOCHS.flatMap((e, idx) => [
      `Epoch ${idx + 1}/${EPOCHS.length}`,
      buildFinalEpochLine(e),
    ]),
  ];
  scheduleTimeout(() => {
    showCursor.value = false;
    emit("finished");
  }, 50);
}

onMounted(() => {
  if (import.meta.server) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    runReducedMotion();
  } else {
    runFullAnimation();
  }
});

onBeforeUnmount(() => {
  timeouts.forEach((id) => clearTimeout(id));
  timeouts.clear();
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <section ref="loaderRoot" class="loader" aria-live="polite" aria-busy="true">
    <div class="terminal">
      <div class="reis-line">
        <NuxtLink to="/" class="name">{{ displayedText }}</NuxtLink>
        <span v-if="showCursor" class="cursor" />
      </div>
      <pre v-if="outputText" class="output">{{ outputText }}</pre>
    </div>
    <div class="crt-scanlines" aria-hidden="true" />
  </section>
</template>

<style scoped>
.loader {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
}

.terminal {
  position: absolute;
  top: 20vh;
  left: 50%;
  width: min(90vw, 48rem);
  color: #22c55e;
  text-align: left;
  text-shadow:
    0 0 1px rgb(34 197 94 / 90%),
    0 0 4px rgb(34 197 94 / 50%),
    0 0 12px rgb(34 197 94 / 25%);
  transform: translateX(-50%);
}

.reis-line {
  display: flex;
  align-items: flex-end;
  font-size: clamp(1.25rem, 4.5vw, 1.75rem);
  line-height: 1;
}

.cursor {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  background-color: currentcolor;
}

.output {
  margin-top: 1rem;
  font-size: clamp(0.5rem, 1vw, 0.65rem);
  line-height: 1.5;
  color: inherit;
  white-space: pre-wrap;
}

.crt-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgb(0 0 0 / 0%) 0,
    rgb(0 0 0 / 0%) 2px,
    rgb(0 0 0 / 25%) 3px,
    rgb(0 0 0 / 25%) 4px
  );
  mix-blend-mode: multiply;
}
</style>
