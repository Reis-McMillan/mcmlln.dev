<template>
  <div
    class="space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
  >
    <div class="text-center">
      <h1 class="text-2xl font-bold text-[#00ff41]">Login</h1>
    </div>

    <form v-if="!codeSent" class="space-y-4" @submit.prevent="handleLogin">
      <div>
        <label for="email" class="block text-sm text-gray-300">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="mt-1 w-full rounded border border-gray-700 bg-[#0d0d0d] px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:border-[#00ff41] focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white disabled:opacity-50"
      >
        {{ loading ? "Sending..." : "Send Verification Code" }}
      </button>
      <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
    </form>

    <form v-else class="space-y-4" @submit.prevent="handleVerify">
      <p class="text-sm text-gray-300">
        A verification code was sent to
        <span class="text-[#00ff41]">{{ email }}</span>
      </p>
      <div>
        <label for="code" class="block text-sm text-gray-300">
          Verification Code
        </label>
        <input
          id="code"
          v-model="code"
          type="text"
          inputmode="numeric"
          required
          class="mt-1 w-full rounded border border-gray-700 bg-[#0d0d0d] px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:border-[#00ff41] focus:outline-none"
          placeholder="123456"
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white disabled:opacity-50"
      >
        {{ loading ? "Verifying..." : "Verify" }}
      </button>
      <button
        type="button"
        class="w-full text-sm text-gray-300 hover:text-[#00ff41]"
        @click="codeSent = false"
      >
        Use a different email
      </button>
      <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  redirect: { type: String, default: "/sso-dashboard" },
});

const { login, verify } = useAuth();

const email = ref("");
const code = ref("");
const codeSent = ref(false);
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true;
  error.value = "";
  try {
    await login(email.value);
    codeSent.value = true;
  } catch (e) {
    error.value = e.data?.message || "Failed to send verification code";
  } finally {
    loading.value = false;
  }
}

async function handleVerify() {
  loading.value = true;
  error.value = "";
  try {
    await verify(email.value, code.value);
    await navigateTo(props.redirect);
  } catch (e) {
    error.value = e.data?.message || e.message || "Verification failed";
  } finally {
    loading.value = false;
  }
}
</script>
