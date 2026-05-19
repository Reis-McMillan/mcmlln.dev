<script lang="ts" setup>
useHead({
  title: "Resume — Reis McMillan",
});

const TITLE_CHARS = Array.from("Résumé");

useReveal();

const EDUCATION = {
  school: "Purdue University, College of Science",
  degree: "Bachelor of Science",
  location: "West Lafayette, IN",
  date: "May 2026",
  majors:
    "Data Science, Applied Statistics, Mathematical Statistics, Mathematics",
  minors: "Spanish, Economics",
};

const EXPERIENCE = [
  {
    company: "Concrete Engine",
    role: "Founding Engineer",
    location: "Remote",
    date: "December 2024 – Present",
    bullets: [
      "Engineered a robust solution for handling massive data uploads (exceeding 1TB) by implementing high-performance HTTP routes using Express.js.",
      "Designed and implemented a comprehensive observability infrastructure for High-Performance Computing (HPC) rigs, leveraging Python, Node.js, MongoDB, and Google Cloud Logging to provide real-time insights into system performance and health.",
      "Automated the deployment and management of said infrastructure with Ansible, ensuring scalability and maintainability.",
    ],
  },
  {
    company: "Land O' Lakes Inc.",
    role: "Data Science Intern",
    location: "Arden Hills, MN",
    date: "May – August 2025",
    bullets: [
      "Developed a pricing optimization solution using a Bayesian epsilon-greedy multi-armed bandit algorithm with a Deep Q-Network (DQN) in TensorFlow, analyzing 500,000+ customer interactions to improve pricing decisions, resulting in an estimated 8.4% increase in purchase likelihood.",
      "Leveraged Azure Databricks and PySpark for scalable data preprocessing and pipeline development, enabling efficient handling of large datasets.",
      "Optimized model training by using GPU-accelerated hardware and TensorFlow Graph Execution, reducing runtime from over 24 hours to approximately 2.5 hours.",
    ],
  },
  {
    company: "Keystone Cooperative",
    role: "Data Science Intern",
    location: "Indianapolis, IN",
    date: "May – August 2024",
    bullets: [
      "Implemented a Snowflake web app which assisted business users with the identification of customer account groups from over 130,000+ accounts.",
      "Across 130,000+ accounts, a python script was able to group accounts in less than six minutes by employing disjoint sets/union find data structure and Dijkstra's single-shortest path algorithm.",
      "Created a recurrent neural network (RNN) which predicted the likelihood of a customer purchase; in total the RNN leveraged a total of 3+ GB of data and successfully predicted 94.3% of historical customer purchases.",
    ],
  },
];

const PROJECTS = [
  {
    name: "Moneypenny",
    url: "https://moneypenny.mcmlln.dev",
    display: "moneypenny.mcmlln.dev",
    bullets: [
      "Moneypenny is a Python web application that uses LangGraph and Google's Gemma-4 (exposed via vLLM) to provide an AI email assistant, connecting to an email MCP server for tools like send, trash, search, and read, with a hybrid vector and text search pipeline backed by MongoDB.",
      "The codebase exposes 7 agent tools and 3 database collections, and implements a dual-embedding strategy (full content and metadata) with Reciprocal Rank Fusion for search ranking.",
    ],
  },
  {
    name: "Verys",
    url: "https://verys.mcmlln.dev",
    display: "verys.mcmlln.dev",
    bullets: [
      "Verys is an OpenID Connect authorization server that authenticates users via email verification, manages consent, and issues EdDSA-signed JWTs, exposing 15 API endpoints across authorization, token issuance, identity management, session lifecycle, and federated provider integration.",
      "Verys also acts as a federated identity provider that brokers access to upstream OAuth2 providers (e.g., Microsoft, Google), storing encrypted external tokens and transparently refreshing them, enabling downstream clients to request cross-provider scopes through a single authorization flow.",
    ],
  },
];

const SKILLS = [
  {
    category: "Languages",
    items: ["Python", "R", "Java", "SQL", "JavaScript", "Bash"],
  },
  {
    category: "Infrastructure & Deployment",
    items: [
      "Git",
      "Docker",
      "Kubernetes",
      "Ansible",
      "Google Cloud Platform",
      "Azure Databricks",
      "Snowflake",
    ],
  },
  {
    category: "Data Science & ML",
    items: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Scikit-Learn",
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "Ollama",
      "vLLM",
    ],
  },
  {
    category: "Web Frameworks",
    items: ["Node.js", "Express.js", "Vue.js", "Nuxt", "FastAPI"],
  },
];
</script>

<template>
  <div>
    <div class="dot-grid-bg" aria-hidden="true" />
    <div class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <header class="reveal mb-16">
        <h3 class="mb-4 text-xs font-bold text-[#587B7F]">Reis McMillan</h3>
        <h1 class="inline-block text-6xl font-bold tracking-tight sm:text-7xl">
          <span
            v-for="(char, i) in TITLE_CHARS"
            :key="i"
            class="inline-block origin-bottom transition-transform duration-300 hover:scale-125"
          >
            {{ char }}
          </span>
        </h1>
        <p class="w-1/2">
          Software, AI, and ML engineer dedicated to architecting intelligent,
          scalable applications.
        </p>
      </header>

      <section class="reveal mb-16">
        <h2
          class="relative mb-4 inline-block origin-left px-3 py-1 text-xl tracking-wider uppercase transition-transform duration-300 before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-[''] hover:scale-110"
        >
          Experience
        </h2>
        <div class="mb-10">
          <h3 class="text-xs font-bold text-[#587B7F]">NOTABLE PROJECTS</h3>
          <div
            v-for="(project, i) in PROJECTS"
            :key="project.name"
            :class="i < PROJECTS.length - 1 ? 'mb-6' : ''"
          >
            <h3 class="font-bold">
              {{ project.name }}
              <a
                :href="project.url"
                target="_blank"
                rel="noopener noreferrer"
                class="ml-1 text-sm font-normal text-[#F2F4F3] underline hover:text-[#587B7F]"
              >
                {{ project.display }}
              </a>
            </h3>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li v-for="(bullet, j) in project.bullets" :key="j">
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h3 class="text-xs font-bold text-[#587B7F]">PROFESSIONAL</h3>
          <div v-for="job in EXPERIENCE" :key="job.company" class="mb-6">
            <div
              class="flex flex-col items-start justify-between gap-1 sm:flex-row sm:gap-4"
            >
              <div>
                <h3 class="font-bold">{{ job.role }}</h3>
                <p class="text-xs italic">{{ job.company }}</p>
              </div>
              <div class="shrink-0 text-left text-sm sm:text-right">
                <p class="font-bold text-[#587B7F]">{{ job.location }}</p>
                <p class="text-xs italic">{{ job.date }}</p>
              </div>
            </div>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li v-for="(bullet, j) in job.bullets" :key="j">{{ bullet }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="reveal mb-16">
        <h2
          class="relative mb-4 inline-block origin-left px-3 py-1 text-xl tracking-wider uppercase transition-transform duration-300 before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-[''] hover:scale-110"
        >
          Relevant Skills
        </h2>
        <div class="grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="group in SKILLS" :key="group.category">
            <h3 class="mb-2 text-xs font-bold text-[#587B7F] uppercase">
              {{ group.category }}
            </h3>
            <ul class="list-disc space-y-1 pl-5">
              <li v-for="item in group.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="reveal mb-16">
        <h2
          class="relative mb-4 inline-block origin-left px-3 py-1 text-xl tracking-wider uppercase transition-transform duration-300 before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-[''] hover:scale-110"
        >
          Education
        </h2>
        <div
          class="flex flex-col items-start justify-between gap-1 sm:flex-row sm:gap-4"
        >
          <div>
            <h3 class="font-bold">{{ EDUCATION.school }}</h3>
            <p class="text-xs italic">{{ EDUCATION.degree }}</p>
          </div>
          <div class="shrink-0 text-left sm:text-right">
            <p class="text-sm font-bold text-[#587B7F]">
              {{ EDUCATION.location }}
            </p>
            <p class="text-xs italic">{{ EDUCATION.date }}</p>
          </div>
        </div>
        <p class="mt-2 text-sm">
          <span class="font-bold">Majors:</span>
          {{ EDUCATION.majors }}
        </p>
        <p class="text-sm">
          <span class="font-bold">Minors:</span>
          {{ EDUCATION.minors }}
        </p>
      </section>

      <div class="reveal mb-24 flex">
        <a
          href="/resume.pdf"
          download="Reis-McMillan-Resume.pdf"
          class="inline-flex items-center gap-2 rounded-md border border-[#DD6031] px-5 py-2 text-sm tracking-wider text-[#DD6031] uppercase transition-colors hover:bg-[#DD6031] hover:text-[#040303]"
        >
          Download PDF
        </a>
      </div>
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
</style>
