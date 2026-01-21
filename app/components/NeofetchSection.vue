<template>
  <section id="neofetch" class="overflow-hidden p-6 font-mono">
    <div class="flex flex-col gap-4 md:flex-row md:gap-8">
      <!-- ASCII Logo -->
      <pre
        class="shrink-0 text-xs leading-tight md:text-sm"
        :style="{ color: logoColor }"
      ><template v-for="(line, i) in displayedLogoLines" :key="i">{{ line }}
</template></pre>

      <!-- System Info -->
      <div class="min-w-0 space-y-1 text-xs md:text-sm">
        <div v-for="(line, i) in displayedInfoLines" :key="i">
          <span v-if="line.label" class="text-green-400">{{ line.label }}</span>
          <span v-if="line.label && line.value">:</span>
          <span class="text-gray-300">{{ line.value }}</span>
        </div>

        <!-- Color Blocks -->
        <div v-if="showColorBlocks" class="mt-4">
          <div class="flex">
            <span
              v-for="color in colorRow1"
              :key="color"
              class="h-4 w-4 md:h-5 md:w-5"
              :style="{ backgroundColor: color }"
            />
          </div>
          <div class="flex">
            <span
              v-for="color in colorRow2"
              :key="color"
              class="h-4 w-4 md:h-5 md:w-5"
              :style="{ backgroundColor: color }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(["finished"]);

// ASCII art logo
const logoArt = {
  color: "#00ff41",
  art: [
    " /$$$$$$$            /$$                                            ",
    "| $$__  $$          |__/                                            ",
    "| $$  \\ $$  /$$$$$$  /$$  /$$$$$$$                                  ",
    "| $$$$$$$/ /$$__  $$| $$ /$$_____/                                  ",
    "| $$__  $$| $$$$$$$$| $$|  $$$$$$                                   ",
    "| $$  \\ $$| $$_____/| $$ \\____  $$                                  ",
    "| $$  | $$|  $$$$$$$| $$ /$$$$$$$/                                  ",
    "|__/  |__/ \\_______/|__/|_______/                                   ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    " /$$      /$$           /$$      /$$ /$$ /$$ /$$                    ",
    "| $$$    /$$$          | $$$    /$$$|__/| $$| $$                    ",
    "| $$$$  /$$$$  /$$$$$$$| $$$$  /$$$$ /$$| $$| $$  /$$$$$$  /$$$$$$$ ",
    "| $$ $$/$$ $$ /$$_____/| $$ $$/$$ $$| $$| $$| $$ |____  $$| $$__  $$",
    "| $$  $$$| $$| $$      | $$  $$$| $$| $$| $$| $$  /$$$$$$$| $$  \\ $$",
    "| $$\\  $ | $$| $$      | $$\\  $ | $$| $$| $$| $$ /$$__  $$| $$  | $$",
    "| $$ \\/  | $$|  $$$$$$$| $$ \\/  | $$| $$| $$| $$|  $$$$$$$| $$  | $$",
    "|__/     |__/ \\_______/|__/     |__/|__/|__/|__/ \\_______/|__/  |__/",
  ],
};

// Device info
const deviceInfo = ref([]);
const logoColor = logoArt.color;
const logoLines = logoArt.art;

// Animation state
const displayedLogoLines = ref([]);
const displayedInfoLines = ref([]);
const isFinished = ref(false);
const showColorBlocks = ref(false);

// Terminal color palette (standard 16-color theme)
const colorRow1 = [
  "#1a1a1a",
  "#e74c3c",
  "#2ecc71",
  "#f39c12",
  "#3498db",
  "#9b59b6",
  "#1abc9c",
  "#bdc3c7",
];
const colorRow2 = [
  "#7f8c8d",
  "#ff6b6b",
  "#00ff41",
  "#ffeb3b",
  "#64b5f6",
  "#ce93d8",
  "#4dd0e1",
  "#ffffff",
];

function getBrowserName() {
  if (import.meta.server) return "Unknown";

  const ua = navigator.userAgent;
  if (ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Google Chrome";
  if (ua.includes("Firefox")) return "Mozilla Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Unknown";
}

function getOS() {
  if (import.meta.server) return "Unknown";

  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return navigator.userAgent;
}

function getDeviceType() {
  if (import.meta.server) return "Desktop";

  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) {
    if (/iPad|Tablet/i.test(ua)) return "Tablet";
    return "Mobile";
  }
  return "Desktop";
}

function gatherDeviceInfo() {
  if (import.meta.server) return [];

  const info = [
    { label: "Browser", value: getBrowserName() },
    { label: "OS", value: getOS() },
    { label: "Device", value: getDeviceType() },
    {
      label: "Resolution",
      value: `${window.screen.width}x${window.screen.height}`,
    },
    { label: "Viewport", value: `${window.innerWidth}x${window.innerHeight}` },
    { label: "Language", value: navigator.language || "en-US" },
    {
      label: "Cores",
      value: navigator.hardwareConcurrency
        ? `${navigator.hardwareConcurrency}`
        : "Unknown",
    },
  ];

  // Add memory if available
  if (navigator.deviceMemory) {
    info.push({ label: "Memory", value: `${navigator.deviceMemory} GB` });
  }

  // Add connection info if available
  if (navigator.connection) {
    const conn = navigator.connection;
    if (conn.effectiveType) {
      info.push({
        label: "Connection",
        value: conn.effectiveType.toUpperCase(),
      });
    }
  }

  // Add color depth
  info.push({ label: "Colors", value: `${window.screen.colorDepth}-bit` });

  return info;
}

async function animateNeofetch() {
  // Type out logo lines
  for (let i = 0; i < logoLines.length; i++) {
    displayedLogoLines.value.push(logoLines[i]);

    // Also add corresponding info line if exists
    if (i < deviceInfo.value.length) {
      displayedInfoLines.value.push(deviceInfo.value[i]);
    }

    await new Promise((r) => setTimeout(r, 80));
  }

  // Add remaining info lines
  for (let i = logoLines.length; i < deviceInfo.value.length; i++) {
    displayedInfoLines.value.push(deviceInfo.value[i]);
    await new Promise((r) => setTimeout(r, 60));
  }

  // Show color blocks
  await new Promise((r) => setTimeout(r, 100));
  showColorBlocks.value = true;

  isFinished.value = true;
  emit("finished");
}

onMounted(() => {
  deviceInfo.value = gatherDeviceInfo();
  animateNeofetch();
});
</script>
