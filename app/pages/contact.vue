<script lang="ts" setup>
useHead({
  title: "Contact — Reis McMillan",
});

const TITLE_CHARS = Array.from("Contact");

useReveal();

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const company = ref("");

const isSubmitting = ref(false);
const isSent = ref(false);
const errorMessage = ref("");

async function onSubmit() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  isSent.value = false;
  errorMessage.value = "";
  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value,
        company: company.value,
      },
    });
    isSent.value = true;
    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
  } catch (err: unknown) {
    const msg = (err as { data?: { statusMessage?: string } })?.data
      ?.statusMessage;
    errorMessage.value = msg ?? "Something went wrong. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}
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
        <p class="max-w-2xl">
          Have an idea you would like to discuss? Send a message my way!
        </p>
      </header>

      <section class="reveal mb-16">
        <h2
          class="relative mb-6 inline-block origin-left px-3 py-1 text-xl tracking-wider uppercase transition-transform duration-300 before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-[''] hover:scale-110"
        >
          Send a message
        </h2>
        <form class="grid max-w-3xl gap-6" @submit.prevent="onSubmit">
          <div class="grid gap-6 sm:grid-cols-2">
            <label>
              <span class="form-label">Name</span>
              <input
                v-model="name"
                type="text"
                required
                autocomplete="name"
                class="form-input"
              />
            </label>
            <label>
              <span class="form-label">Email</span>
              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="form-input"
              />
            </label>
          </div>
          <label>
            <span class="form-label">Subject</span>
            <input
              v-model="subject"
              type="text"
              autocomplete="off"
              class="form-input"
            />
          </label>
          <label>
            <span class="form-label">Message</span>
            <textarea
              v-model="message"
              required
              rows="6"
              class="form-input form-textarea"
            />
          </label>
          <input
            v-model="company"
            type="text"
            autocomplete="off"
            tabindex="-1"
            class="honeypot"
            aria-hidden="true"
          />

          <div class="mb-24 flex flex-wrap items-center gap-4 sm:mb-12">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 rounded-md border border-[#DD6031] px-5 py-2 text-sm tracking-wider text-[#DD6031] uppercase transition-colors hover:bg-[#DD6031] hover:text-[#040303] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-[#DD6031]"
            >
              {{ isSubmitting ? "Sending…" : "Send message" }}
            </button>
            <p v-if="isSent" class="text-sm text-[#587B7F]">
              Message sent — thank you, I'll be in touch.
            </p>
            <p v-if="errorMessage" class="text-sm text-[#DD6031]">
              {{ errorMessage }}
            </p>
          </div>
        </form>
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

.form-label {
  display: block;
  margin-bottom: 6px;
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 11px;
  font-weight: bold;
  color: #587b7f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  font-family: "SUSE Mono", ui-monospace, monospace;
  font-size: 14px;
  color: #f2f4f3;
  background: rgb(255 255 255 / 4%);
  border: 1px solid rgb(88 123 127 / 40%);
  border-radius: 6px;
  transition:
    border-color 200ms ease-out,
    background 200ms ease-out;
}

.form-input:focus {
  outline: none;
  background: rgb(255 255 255 / 8%);
  border-color: #dd6031;
}

.form-textarea {
  min-height: 140px;
  resize: vertical;
}

.honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>
