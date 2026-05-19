<script setup lang="ts">
const route = useRoute();
const siteUrl = useRuntimeConfig().public.siteUrl;

const FALLBACK_TITLE = "Reis McMillan — AI & ML Engineer";
const FALLBACK_DESCRIPTION =
  "AI & ML engineer building intelligent software at the intersection of data, math, and design.";

const pageTitle = computed(
  () => (route.meta.seoTitle as string | undefined) ?? FALLBACK_TITLE
);
const pageDescription = computed(
  () =>
    (route.meta.seoDescription as string | undefined) ?? FALLBACK_DESCRIPTION
);
const pageUrl = computed(
  () => `${siteUrl}${route.path === "/" ? "/" : route.path}`
);

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogType: "website",
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogUrl: () => pageUrl.value,
  ogSiteName: "Reis McMillan",
  ogLocale: "en_US",
  ogImage: {
    url: `${siteUrl}/og-image.png`,
    width: 1200,
    height: 630,
    alt: "Reis McMillan — engineer building intelligent software",
  },
  twitterCard: "summary_large_image",
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => pageDescription.value,
  twitterImage: `${siteUrl}/og-image.png`,
  robots: "index, follow",
});

useHead({
  link: [{ rel: "canonical", href: () => pageUrl.value }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Reis McMillan",
        url: siteUrl,
        image: `${siteUrl}/portrait_v1.jpg`,
        jobTitle: "AI & ML Engineer",
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Purdue University",
        },
        sameAs: [
          "https://github.com/Reis-McMillan",
          "https://www.linkedin.com/in/reis-mcmillan/",
        ],
      }),
    },
  ],
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="var(--color-brand)" :height="2" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
