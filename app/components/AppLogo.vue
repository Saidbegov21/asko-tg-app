<script setup lang="ts">
defineProps<{
  subtitle?: string;
}>();
</script>

<template>
  <div class="text-center">
    <div class="flex justify-center mb-2">
      <div class="flex items-baseline italic">
        <span class="text-red-600 text-4xl font-black tracking-tighter">A</span>
        <span class="text-red-600 text-3xl font-black tracking-tighter">sko</span>
        <div class="w-1.5 h-1.5 bg-red-600 ml-1 rounded-full animate-pulse"></div>
      </div>
    </div>
    <p v-if="subtitle" class="text-sm font-medium text-slate-400">{{ subtitle }}</p>
  </div>
</template>