<script lang="ts" setup>
useHead({
  title: "About — Reis McMillan",
});

const TITLE_CHARS = Array.from("About");

interface CardItem {
  id: string;
  title: string;
  image: string;
}

const BOOKS: CardItem[] = [
  {
    id: "sun",
    title: "The Sun Also Rises",
    image: "/the-sun-also-rises.jpg",
  },
  {
    id: "solitude",
    title: "One Hundred Years of Solitude",
    image: "/one-hundred-years.jpg",
  },
  {
    id: "fury",
    title: "The Sound and the Fury",
    image: "/the-sound-and-the-fury.jpg",
  },
];

const SHOWS: CardItem[] = [
  { id: "ozark", title: "Ozark", image: "/ozark.jpeg" },
  { id: "bb", title: "Breaking Bad", image: "/breaking-bad.jpg" },
  { id: "euphoria", title: "Euphoria", image: "/euphoria.jpg" },
];

const MUSIC: CardItem[] = [
  { id: "peso-pluma", title: "Peso Pluma", image: "/la-patrulla.jpg" },
  { id: "j-cole", title: "J Cole", image: "/j-cole.jpg" },
  { id: "mahler", title: "Mahler", image: "/mahler.jpg" },
];

const TRAVEL: CardItem[] = [
  { id: "travel-1", title: "Travel 1", image: "/travel-1.jpeg" },
  { id: "travel-2", title: "Travel 2", image: "/travel-2.jpeg" },
  { id: "travel-3", title: "Travel 3", image: "/travel-3.jpeg" },
];

const activeBook = ref<string | null>(null);
const activeShow = ref<string | null>(null);
const activeMusic = ref<string | null>(null);
const activeTravel = ref<string | null>(null);

const musicAudios = new Map<string, HTMLAudioElement>();
let currentMusicId: string | null = null;

const TRAVEL_ROTATE_MS = 2500;
let travelTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  for (const m of MUSIC) {
    const audio = new Audio(`/${m.id}.mp3`);
    audio.preload = "auto";
    audio.volume = 0.5;
    musicAudios.set(m.id, audio);
  }

  let travelIdx = 0;
  activeTravel.value = TRAVEL[travelIdx]!.id;
  travelTimer = setInterval(() => {
    travelIdx = (travelIdx + 1) % TRAVEL.length;
    activeTravel.value = TRAVEL[travelIdx]!.id;
  }, TRAVEL_ROTATE_MS);
});

onBeforeUnmount(() => {
  for (const audio of musicAudios.values()) {
    audio.pause();
    audio.src = "";
  }
  musicAudios.clear();

  if (travelTimer) {
    clearInterval(travelTimer);
    travelTimer = null;
  }
});

function playMusic(id: string) {
  activeMusic.value = id;
  if (currentMusicId && currentMusicId !== id) {
    musicAudios.get(currentMusicId)?.pause();
  }
  const audio = musicAudios.get(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    currentMusicId = id;
  }
}

function stopMusic() {
  activeMusic.value = null;
  if (currentMusicId) {
    musicAudios.get(currentMusicId)?.pause();
    currentMusicId = null;
  }
}

function fanStyle(index: number, total: number, active: boolean) {
  if (active) {
    return {
      transform: "translate(-50%, -55%) rotate(0deg) scale(1.08)",
      zIndex: 50,
    };
  }
  const offset = index - (total - 1) / 2;
  const rotate = offset * 14;
  const tx = offset * 50;
  return {
    transform: `translate(calc(-50% + ${tx}px), -50%) rotate(${rotate}deg)`,
    zIndex: 10 + index,
  };
}

interface MonkeytypeRank {
  rank: number;
  wpm: number;
  acc: number;
  raw: number;
  consistency: number;
  timestamp: number;
}

interface MonkeytypeStats {
  completedTests: number;
  startedTests: number;
  timeTyping: number;
}

interface MonkeytypePayload {
  rank15: MonkeytypeRank | null;
  rank60: MonkeytypeRank | null;
  stats: MonkeytypeStats | null;
}

const {
  data: mt,
  pending: mtPending,
  error: mtError,
} = await useFetch<MonkeytypePayload>("/api/monkeytype", {
  lazy: true,
  server: true,
});

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

useReveal();
</script>

<template>
  <div>
    <div class="dot-grid-bg" aria-hidden="true" />
    <div class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <header
        class="reveal mb-16 grid items-start gap-8 sm:grid-cols-[auto_1fr]"
      >
        <img
          src="/portrait_v1.jpg"
          alt="Portrait of Reis McMillan"
          class="portrait"
        />
        <div>
          <h3 class="mb-4 text-xs font-bold text-[#587B7F]">Reis McMillan</h3>
          <h1
            class="mb-4 inline-block text-6xl font-bold tracking-tight sm:text-7xl"
          >
            <span
              v-for="(char, i) in TITLE_CHARS"
              :key="i"
              class="inline-block origin-bottom transition-transform duration-300 hover:scale-125"
            >
              {{ char }}
            </span>
          </h1>
          <p class="w-96">
            Engineer building intelligent software at the intersection of data,
            math, and design.
          </p>
        </div>
      </header>

      <section class="reveal mb-16">
        <h2
          class="relative mb-4 inline-block origin-left px-3 py-1 text-xl tracking-wider uppercase transition-transform duration-300 before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-[''] hover:scale-110"
        >
          My Story
        </h2>
        <div class="max-w-3xl space-y-4 text-sm">
          <p>
            I’ve long been fascinated by machine learning and artificial
            intelligence, well before large language models became mainstream.
            Growing up as a digital native, it was clear to me that the massive
            volume of data we generate daily through our devices holds genuine,
            transformative potential. Driven by this realization, I chose to
            pursue a degree in Data Science at Purdue University to understand
            how to harness that power.
          </p>
          <p>
            Early in my academic journey, it became obvious that impactful data
            science relies on a rigorous blend of foundational disciplines. My
            curiosity pushed me to dive deeper, ultimately leading me to expand
            my studies into triple majors by adding Mathematics and Applied
            Statistics. This gave me the theoretical depth needed to truly
            understand the mechanics behind modern AI models.
          </p>
          <p>
            However, I also noticed a common pitfall in the discipline: data
            science often lacks rigorous software engineering principles,
            meaning powerful models frequently begin, live, and die inside
            isolated notebooks. My role as a Founding Engineer at Concrete
            Engine bridged this gap. It allowed me to master the vital software
            engineering and infrastructure principles required to take models
            out of production sandboxes and build robust, high-performance
            systems that scale.
          </p>
          <p>
            With this distinct foundation—combining deep theoretical data
            science with battle-tested software engineering—I am uniquely
            positioned to pursue my passion: engineering high-quality, scalable
            applications with machine learning and AI at their core.
          </p>
        </div>
      </section>

      <section class="reveal mb-16">
        <h2
          class="relative mb-4 inline-block origin-left px-3 py-1 text-xl tracking-wider uppercase transition-transform duration-300 before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-[''] hover:scale-110"
        >
          Beyond Code
        </h2>

        <p class="mb-10 max-w-3xl text-sm">
          When I'm not working on a project, I spend my free time doing a number
          of other things.
        </p>

        <div class="mb-12 grid items-center gap-4 sm:grid-cols-2">
          <div>
            <h3 class="mb-2 font-bold text-[#587B7F]">Books</h3>
            <p class="text-sm">
              I like to read literary fiction. Some of my favorite works are
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="activeBook = 'sun'"
                @mouseleave="activeBook = null"
              >
                The Sun Also Rises
              </span>
              by Ernest Hemingway,
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="activeBook = 'solitude'"
                @mouseleave="activeBook = null"
              >
                One Hundred Years of Solitude
              </span>
              by Gabriel García Márquez, and
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="activeBook = 'fury'"
                @mouseleave="activeBook = null"
              >
                The Sound and the Fury
              </span>
              by William Faulkner.
            </p>
          </div>
          <div class="card-fan">
            <img
              v-for="(book, i) in BOOKS"
              :key="book.id"
              :src="book.image"
              :alt="book.title"
              class="card"
              :style="fanStyle(i, BOOKS.length, activeBook === book.id)"
            />
          </div>
        </div>

        <div class="mb-12 grid items-center gap-4 sm:grid-cols-2">
          <div class="card-fan order-2 sm:order-0">
            <img
              v-for="(show, i) in SHOWS"
              :key="show.id"
              :src="show.image"
              :alt="show.title"
              class="card"
              :style="fanStyle(i, SHOWS.length, activeShow === show.id)"
            />
          </div>
          <div class="order-1">
            <h3 class="mb-2 font-bold text-[#587B7F]">Television</h3>
            <!-- prettier-ignore -->
            <p class="text-sm">
              I enjoy great television. Some of my favorite series are
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="activeShow = 'ozark'"
                @mouseleave="activeShow = null"
              >Ozark</span>,
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="activeShow = 'bb'"
                @mouseleave="activeShow = null"
              >Breaking Bad</span>, and
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="activeShow = 'euphoria'"
                @mouseleave="activeShow = null"
              >Euphoria</span>.
            </p>
          </div>
        </div>

        <div class="mb-12 grid items-center gap-4 sm:grid-cols-2">
          <div>
            <h3 class="mb-2 font-bold text-[#587B7F]">Music</h3>
            <!-- prettier-ignore -->
            <p class="text-sm">
              My music taste is all over the place. Sometimes I like listening to
              artists like
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="playMusic('peso-pluma')"
                @mouseleave="stopMusic"
              >Peso Pluma</span> and
              <strong class="text-[#DD6031] italic">Netón Vega</strong>.
              Other times it might be rappers like
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="playMusic('j-cole')"
                @mouseleave="stopMusic"
              >J Cole</span> or
              <strong class="text-[#DD6031] italic">The Notorious B.I.G.</strong>.
              And I even like to add in a little classical music from
              <span
                class="cursor-pointer font-bold text-[#DD6031] italic"
                @mouseenter="playMusic('mahler')"
                @mouseleave="stopMusic"
              >Mahler</span>, and
              <strong class="text-[#DD6031] italic">William Grant Still</strong>.
            </p>
          </div>
          <div class="card-fan square">
            <img
              v-for="(track, i) in MUSIC"
              :key="track.id"
              :src="track.image"
              :alt="track.title"
              class="card"
              :style="fanStyle(i, MUSIC.length, activeMusic === track.id)"
            />
          </div>
        </div>

        <div class="mb-12 grid items-center gap-4 sm:grid-cols-2">
          <div class="card-fan order-2 sm:order-0">
            <img
              v-for="(photo, i) in TRAVEL"
              :key="photo.id"
              :src="photo.image"
              :alt="photo.title"
              class="card"
              :style="fanStyle(i, TRAVEL.length, activeTravel === photo.id)"
            />
          </div>
          <div class="order-1">
            <h3 class="mb-2 font-bold text-[#587B7F]">Travel</h3>
            <!-- prettier-ignore -->
            <p class="text-sm">
              Seeing the world is important to me. I've been to
              <strong class="text-[#DD6031] italic">Cabo</strong>,
              <strong class="text-[#DD6031] italic">Cancún</strong>, and
              <strong class="text-[#DD6031] italic">Mazatlán</strong> in México.
              I've also travelled to
              <strong class="text-[#DD6031] italic">Costa Rica</strong>,
              <strong class="text-[#DD6031] italic">Panamá</strong>, and
              <strong class="text-[#DD6031] italic">Belize</strong>.
            </p>
          </div>
        </div>

        <div class="max-w-3xl">
          <h3 class="mb-2 font-bold text-[#587B7F]">Monkeytype</h3>
          <!-- prettier-ignore -->
          <p class="text-sm">
            I've also developed a little bit of what some might call an
            obsession with typing — I grind English 15s and 60s on <a
              href="https://monkeytype.com/profile/Reis"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[#DD6031] underline hover:text-[#587B7F]"
            >Monkeytype</a>. Live from the API:
          </p>

          <div v-if="mtPending" class="mt-4 text-xs text-[#587B7F]">
            Loading stats…
          </div>
          <div v-else-if="mtError" class="mt-4 text-xs text-[#587B7F]">
            (Couldn't reach the Monkeytype API right now.)
          </div>
          <div
            v-else-if="mt"
            class="mt-4 grid auto-rows-fr grid-cols-2 gap-6 text-sm sm:grid-cols-4"
          >
            <div
              v-if="mt.rank15"
              class="glass-pane engraved interactive"
              :style="{ '--tint-color': '#DD6031' }"
            >
              <div class="text-xs font-bold text-[#587B7F]">English 15s</div>
              <div class="font-bold">Rank #{{ mt.rank15.rank }}</div>
              <div class="text-xs">
                {{ Math.round(mt.rank15.wpm) }} wpm ·
                {{ Math.round(mt.rank15.acc) }}%
              </div>
            </div>
            <div
              v-if="mt.rank60"
              class="glass-pane engraved interactive"
              :style="{ '--tint-color': '#DD6031' }"
            >
              <div class="text-xs font-bold text-[#587B7F]">English 60s</div>
              <div class="font-bold">Rank #{{ mt.rank60.rank }}</div>
              <div class="text-xs">
                {{ Math.round(mt.rank60.wpm) }} wpm ·
                {{ Math.round(mt.rank60.acc) }}%
              </div>
            </div>
            <div
              v-if="mt.stats"
              class="glass-pane engraved interactive"
              :style="{ '--tint-color': '#DD6031' }"
            >
              <div class="text-xs font-bold text-[#587B7F]">
                Tests Completed
              </div>
              <div class="font-bold">
                {{ mt.stats.completedTests.toLocaleString() }}
              </div>
            </div>
            <div
              v-if="mt.stats"
              class="glass-pane engraved interactive"
              :style="{ '--tint-color': '#DD6031' }"
            >
              <div class="text-xs font-bold text-[#587B7F]">Time Typing</div>
              <div class="font-bold">{{ formatTime(mt.stats.timeTyping) }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="reveal mb-24 sm:mb-16">
        <h2
          class="relative mb-4 inline-block origin-left px-3 py-1 text-xl tracking-wider uppercase transition-transform duration-300 before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-[''] hover:scale-110"
        >
          Get In Touch
        </h2>
        <p class="mb-6 max-w-3xl text-sm">
          If you're working on something interesting at the intersection of
          data, infrastructure, or AI — say hi.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 rounded-md border border-[#DD6031] px-5 py-2 text-sm tracking-wider text-[#DD6031] uppercase transition-colors hover:bg-[#DD6031] hover:text-[#040303]"
        >
          Contact me
          <Icon name="lucide:arrow-right" size="16" />
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dot-grid-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(circle, #587b7f 1px, transparent 1.5px);
  background-size: 24px 24px;
  opacity: 0.2;
  mask-image: radial-gradient(ellipse at 30% 30%, black 10%, transparent 90%);
}

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 420ms ease-out,
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.portrait {
  width: 16rem;
  height: 20rem;
  object-fit: cover;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 0.5rem;
  box-shadow:
    0 12px 24px -8px rgb(0 0 0 / 60%),
    0 4px 8px rgb(0 0 0 / 30%);
}

.card-fan {
  position: relative;
  height: 22rem;
  min-height: 22rem;
}

.card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 11rem;
  height: 16.5rem;
  object-fit: cover;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 0.25rem;
  box-shadow:
    0 12px 24px -8px rgb(0 0 0 / 60%),
    0 4px 8px rgb(0 0 0 / 30%);
  transform-origin: center;
  transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.card-fan.square .card {
  width: 13rem;
  height: 13rem;
}
</style>
