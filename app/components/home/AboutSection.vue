<template>
  <section
    id="about"
    class="jelly-section space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
    style="min-height: 90px"
  >
    <h2 class="flex text-2xl font-bold">
      <span class="mr-2">></span>
      About Me
    </h2>
    <div class="relative text-lg leading-relaxed text-gray-300">
      <p>
        As a Data Science, Statistics, and Mathematics student at Purdue
        University, I engineer high-performance, data-driven applications at the
        intersection of rigorous theory and scalable infrastructure. My
        technical interests center on deep learning, reinforcement learning, and
        Bayesian methods, with a professional focus on AI/ML engineering.
      </p>
      <br />
      <p>
        Currently, I am a Founding Engineer at Concrete Engine, where I lead a
        team building the future of high-performance computing by designing
        robust observability and data-handling systems.
      </p>
    </div>

    <div class="flex justify-end">
      <a
        href="/resume.pdf"
        download="reis-mcmillan-resume.pdf"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Download Resume
      </a>
    </div>
  </section>
</template>
