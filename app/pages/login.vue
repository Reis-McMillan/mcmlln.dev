<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <LoginForm :redirect="redirect" />
  </div>
</template>

<script setup>
const route = useRoute();
const redirect = computed(() => route.query.redirect || "/sso-dashboard");
</script>
