<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const hovered = ref(0);

const labels: Record<number, string> = {
  1: "Очень плохо",
  2: "Плохо",
  3: "Нормально",
  4: "Хорошо",
  5: "Отлично!",
};

const label = computed(() => {
  const active = hovered.value || props.modelValue;
  return active ? labels[active] : "Поставьте оценку";
});
</script>

<template>
  <div class="rounded-3xl bg-slate-50 p-6 flex flex-col items-center gap-3">
    <div class="flex gap-1">
      <button
        v-for="star in 5"
        :key="star"
        type="button"
        @click="emit('update:modelValue', star)"
        @mouseenter="hovered = star"
        @mouseleave="hovered = 0"
        :disabled="disabled"
        class="transition-transform hover:scale-110 active:scale-75 cursor-pointer select-none"
      >
        <span
          class="text-4xl leading-none transition-all duration-200"
          :class="star <= (hovered || modelValue) ? 'text-yellow-400' : 'text-slate-200'"
        >★</span>
      </button>
    </div>
    <span
      class="text-sm font-medium transition-colors"
      :class="modelValue ? 'text-yellow-500' : 'text-red-400'"
    >
      {{ label }}
    </span>
  </div>
</template>