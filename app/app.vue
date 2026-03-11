<script setup>
onMounted(() => {
  if (import.meta.client && window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
  }
});
</script>

<template>
  <UApp>
    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
