<script setup lang="ts">
const AI_ML_SKILLS = [
  {
    name: "Python",
    icon: "logos:python",
    description:
      "A general-purpose programming language with deep library support for data science, machine learning, and scientific computing.",
  },
  {
    name: "TensorFlow",
    icon: "logos:tensorflow",
    description:
      "An open-source machine learning framework by Google for building, training, and deploying models at scale.",
  },
  {
    name: "PyTorch",
    icon: "logos:pytorch-icon",
    description:
      "An open-source ML framework with dynamic computation graphs, widely used for research and rapid prototyping.",
  },
  {
    name: "PySpark",
    icon: "logos:apache-spark",
    description:
      "The Python API for Apache Spark — a distributed engine for large-scale data processing across clusters.",
  },
  {
    name: "Scikit-Learn",
    icon: "devicon:scikitlearn",
    description:
      "A Python library covering classical machine learning: classification, regression, clustering, and feature engineering.",
  },
  {
    name: "Pandas",
    icon: "logos:pandas-icon",
    description:
      "A Python library for data manipulation and analysis built around the DataFrame primitive.",
  },
  {
    name: "Snowflake",
    icon: "logos:snowflake-icon",
    description:
      "A cloud-native data warehouse that separates storage and compute, designed for analytics on large datasets.",
  },
  {
    name: "vLLM",
    icon: "/icons/vllm.svg",
    description:
      "A high-throughput inference engine for large language models, with paged attention and efficient memory management.",
  },
  {
    name: "ROCm",
    icon: "/icons/amd-rocm.webp",
    description:
      "AMD's open-source platform for GPU-accelerated compute, supporting training and inference on AMD hardware.",
  },
  {
    name: "MLflow",
    icon: "/icons/mlflow.svg",
    description:
      "An open-source platform for managing the ML lifecycle: experiment tracking, model registry, and deployment.",
  },
  {
    name: "OLLama",
    icon: "devicon:ollama",
    description:
      "A tool for running open-source large language models locally through a simple CLI and REST API.",
  },
  {
    name: "LangChain",
    icon: "/icons/langchain.svg",
    description:
      "A framework for composing LLM-powered applications with chains, agents, retrieval, and tool integrations.",
  },
];
const CLOUD_SKILLS = [
  {
    name: "Google Cloud",
    icon: "logos:google-cloud",
    description:
      "Google's cloud computing platform offering compute, storage, networking, and managed data and ML services.",
  },
  {
    name: "Azure",
    icon: "logos:microsoft-azure",
    description:
      "Microsoft's cloud platform providing infrastructure, platform, and software services across compute, data, and AI.",
  },
  {
    name: "Kubernetes",
    icon: "logos:kubernetes",
    description:
      "An open-source system for automating deployment, scaling, and orchestration of containerized applications.",
  },
  {
    name: "ArgoCD",
    icon: "logos:argo",
    description:
      "A declarative GitOps continuous-delivery tool for Kubernetes that reconciles cluster state with Git repositories.",
  },
  {
    name: "Ansible",
    icon: "mdi:ansible",
    description:
      "An open-source automation tool for configuration management, application deployment, and infrastructure orchestration.",
  },
  {
    name: "Docker",
    icon: "logos:docker-icon",
    description:
      "A platform for packaging and running applications in lightweight, portable, isolated containers.",
  },
  {
    name: "Bash",
    icon: "logos:bash-icon",
    description:
      "A Unix shell and command-line scripting language used widely for system administration and automation.",
  },
  {
    name: "Git",
    icon: "logos:git-icon",
    description:
      "A distributed version control system for tracking source code changes and coordinating work across contributors.",
  },
  {
    name: "GitHub Actions",
    icon: "logos:github-actions",
    description:
      "A CI/CD platform built into GitHub for automating build, test, and deployment workflows from a repository.",
  },
];
const WEB_SKILLS = [
  {
    name: "Node.js",
    icon: "logos:nodejs-icon",
    description:
      "A JavaScript runtime built on the V8 engine for executing JavaScript outside the browser, typically on servers.",
  },
  {
    name: "Express.js",
    icon: "skill-icons:expressjs-light",
    description:
      "A minimal, unopinionated web framework for building HTTP servers and APIs in Node.js.",
  },
  {
    name: "PostgreSQL",
    icon: "logos:postgresql",
    description:
      "An open-source object-relational database known for reliability, extensibility, and strong SQL standards compliance.",
  },
  {
    name: "MongoDB",
    icon: "logos:mongodb-icon",
    description:
      "A document-oriented NoSQL database that stores data as flexible, JSON-like BSON documents.",
  },
  {
    name: "JavaScript",
    icon: "logos:javascript",
    description:
      "The programming language of the web, running in every browser and increasingly on the server and at the edge.",
  },
  {
    name: "Nuxt",
    icon: "logos:nuxt",
    description:
      "A Vue-based meta-framework providing SSR, file-based routing, auto-imports, and a rich module ecosystem.",
  },
  {
    name: "Vue.js",
    icon: "logos:vue",
    description:
      "A progressive JavaScript framework for building user interfaces with a reactive component model.",
  },
  {
    name: "FastAPI",
    icon: "logos:fastapi",
    description:
      "A modern Python web framework for building APIs using type hints, async support, and automatic OpenAPI generation.",
  },
  {
    name: "Redis",
    icon: "logos:redis",
    description:
      "An in-memory data structure store used as a database, cache, message broker, and streaming engine.",
  },
];
</script>

<template>
  <div ref="mainContainer" class="relative">
    <HomeAboutSection />
    <HomeSphereSkillsSection
      title="AI & ML Engineering"
      description="Most of my recent projects have an LLM at their core — doing retrieval, agentic reasoning, or structured extraction. I care less about the model than about the system around it: the queues, the eval loops, the fallbacks for when generation goes sideways."
      :icons="AI_ML_SKILLS"
      :scroll-start="14"
      :scroll-end="22"
    />
    <HomeSphereSkillsSection
      title="Cloud Infrastructure & Deployment"
      description="Almost everything I ship runs on infrastructure I manage myself. I treat clusters and deployments as code — every change lands through a pull request, and the live state reconciles against the repo. Keeps me honest and makes 2 AM debugging tractable."
      :icons="CLOUD_SKILLS"
      :scroll-start="25"
      :scroll-end="33"
    />
    <HomeSphereSkillsSection
      title="Software & Web Development"
      description="I lean toward full-stack work: a typed backend doing the heavy lifting, a reactive frontend that stays out of its own way, and a schema I actually trust. Small and opinionated beats clever every time."
      :icons="WEB_SKILLS"
      :scroll-start="36"
      :scroll-end="44"
    />
    <HomeProjectsSection :scroll-start="50" :scroll-end="80" />
    <div aria-hidden="true" class="pointer-events-none h-[1200vh]" />
    <HomeContactSection />
  </div>
</template>
