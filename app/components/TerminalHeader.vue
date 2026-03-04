<template>
  <header class="terminal-header">
    <div class="header-line">
      <div>
        <NuxtLink to="/" class="name">{{ displayedText }}</NuxtLink>
        <span class="cursor"></span>
      </div>
      <div v-if="animationDone" class="sso-links">
        <NuxtLink to="/sso-dashboard" class="sso-badge">sso</NuxtLink>
        <NuxtLink to="/coin-monster-dashboard" class="sso-badge">
          coin-monster
        </NuxtLink>
        <NuxtLink v-if="!isAuthenticated" to="/login" class="sso-badge">
          login
        </NuxtLink>
        <span v-else class="sso-badge" @click="showLogoutDialog = true">
          logout
        </span>
      </div>
    </div>
  </header>
  <LogoutDialog v-model="showLogoutDialog" />
</template>

<script setup>
const emit = defineEmits(["finished"]);
const { isAuthenticated, checkAuth } = useAuth();
const showLogoutDialog = ref(false);

const name = "./reis ";
const displayedText = ref("");
const typeSpeed = 200;
const animationDone = ref(false);

onMounted(() => {
  checkAuth();

  let i = 0;
  const timer = setInterval(() => {
    if (i < name.length) {
      displayedText.value += name.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      animationDone.value = true;
      emit("finished");
    }
  }, typeSpeed);
});
</script>

<style scoped>
.terminal-header {
  padding: 1rem;
  font-size: 3rem;
}

.header-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sso-links {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-right: 5rem;
}

.sso-badge {
  font-size: 2rem;
}

.sso-badge:hover {
  text-decoration: underline;
  cursor: pointer;
}

.cursor {
  display: inline-block;
  width: 1.8rem;
  height: 3rem;
  background-color: currentcolor;
}
</style>
