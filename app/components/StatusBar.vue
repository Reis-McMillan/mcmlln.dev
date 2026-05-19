<script setup lang="ts">
interface WeatherPayload {
  tempF: number;
  code: number;
  label: string;
}

const { data: weather, error: weatherError } = await useFetch<WeatherPayload>(
  "/api/weather",
  {
    lazy: true,
    server: true,
  }
);

const clock = ref("--:--:--");
const clockFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Indiana/Indianapolis",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

let clockInterval: ReturnType<typeof setInterval> | null = null;
let clockTimeout: ReturnType<typeof setTimeout> | null = null;

function tick() {
  clock.value = clockFormatter.format(new Date());
}

onMounted(() => {
  tick();
  const msToNextSecond = 1000 - (Date.now() % 1000);
  clockTimeout = setTimeout(() => {
    tick();
    clockInterval = setInterval(tick, 1000);
  }, msToNextSecond);

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("focusin", handleFocusIn);
  document.addEventListener("focusout", handleFocusOut);
});

onBeforeUnmount(() => {
  if (clockTimeout) clearTimeout(clockTimeout);
  if (clockInterval) clearInterval(clockInterval);
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("focusin", handleFocusIn);
  document.removeEventListener("focusout", handleFocusOut);
});

const showWeather = computed(() => !weatherError.value && !!weather.value);

const isNavActive = useState("orbital-nav-active", () => false);
const asymptoteDone = useState("asymptote-done", () => false);
const isFooterVisible = useState("footer-visible", () => false);
const route = useRoute();

const AT_TOP_THRESHOLD_PX = 80;
const isAtTop = ref(true);
const isInputFocused = ref(false);

function handleScroll() {
  isAtTop.value = window.scrollY < AT_TOP_THRESHOLD_PX;
}

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function handleFocusIn(e: FocusEvent) {
  if (isFormField(e.target)) isInputFocused.value = true;
}

function handleFocusOut(e: FocusEvent) {
  if (isFormField(e.target)) isInputFocused.value = false;
}

const isReady = computed(() => {
  // Home page intro: wait for the asymptote animation to finish first.
  if (route.path === "/" && !asymptoteDone.value) return false;
  // Home: visible at top of page AND when footer reappears at the bottom.
  // Other pages: visible only at top — never reappear with the footer.
  if (route.path === "/") return isAtTop.value || isFooterVisible.value;
  return isAtTop.value;
});
</script>

<template>
  <header
    class="status-bar"
    :class="{ 'is-hidden': isNavActive || !isReady || isInputFocused }"
    aria-label="Site status"
  >
    <span class="rule rule--start" />
    <NuxtLink to="/" class="text text--name">Reis McMillan</NuxtLink>
    <span class="rule rule--mid mobile-hidden" />
    <span class="text mobile-hidden">West Lafayette</span>
    <template v-if="showWeather">
      <span class="rule rule--mid mobile-hidden" />
      <span class="text mobile-hidden">
        {{ weather!.tempF }}° {{ weather!.label }}
      </span>
    </template>
    <span class="rule rule--mid" />
    <span class="text text--clock">{{ clock }}</span>
    <span class="rule rule--end" />
  </header>
</template>

<style scoped>
.status-bar {
  position: fixed;
  top: 3%;
  right: 0;
  left: 0;
  z-index: 45;
  display: flex;
  align-items: center;
  height: 28px;
  padding: env(safe-area-inset-top) 24px 0;
  pointer-events: none;
  transform: translateY(0);
  transition:
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 260ms ease-out;
}

@media (width < 640px) {
  .status-bar {
    padding-right: 16px;
    padding-left: 16px;
  }

  .mobile-hidden {
    display: none;
  }
}

.status-bar.is-hidden {
  opacity: 0;
  transform: translateY(-150%);
}

.rule {
  flex: 0 0 auto;
  height: 1px;
  background: #dd6031;
}

/* stylelint-disable-next-line selector-class-pattern */
.rule--start {
  width: 24px;
}

/* stylelint-disable-next-line selector-class-pattern */
.rule--mid {
  width: 32px;
}

/* stylelint-disable-next-line selector-class-pattern */
.rule--end {
  flex: 1 1 auto;
}

.text {
  flex: 0 0 auto;
  padding: 0 12px;
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 11px;
  color: #587b7f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

/* stylelint-disable-next-line selector-class-pattern */
.text--name {
  color: #f2f4f3;
  pointer-events: auto;
  cursor: pointer;
  transition: color 200ms ease-out;
}

/* stylelint-disable-next-line selector-class-pattern */
.text--name:hover {
  color: #dd6031;
}

/* stylelint-disable-next-line selector-class-pattern */
.text--clock {
  font-variant-numeric: tabular-nums;
}
</style>
