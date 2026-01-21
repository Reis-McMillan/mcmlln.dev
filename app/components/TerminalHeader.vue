<template>
  <header class="terminal-header">
    <span class="name">{{ displayedText }}</span>
    <span class="cursor"></span>
  </header>
</template>

<script setup>
const emit = defineEmits(["finished"]);

const name = "./reis ";
const displayedText = ref("");
const typeSpeed = 200;

onMounted(() => {
  let i = 0;
  const timer = setInterval(() => {
    if (i < name.length) {
      displayedText.value += name.charAt(i);
      i++;
    } else {
      clearInterval(timer);
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

.cursor {
  display: inline-block;

  /* Adjust width/height to match your font's character size */
  width: 1.8rem;
  height: 3rem;
  background-color: currentcolor; /* Inherits your text color */
}
</style>
