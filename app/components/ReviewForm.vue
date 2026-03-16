<script setup lang="ts">
import { vMaska } from "maska/vue";
import type { FormSubmitEvent } from "#ui/types";
import { ReviewSchema, type ReviewFormData, azsForSelect, ezsForSelect } from "~/schema/schema";

type StationType = "АЗС" | "ЭЗС";

const props = defineProps<{
  selectedType: StationType;
  loading: boolean;
  submitted: boolean;
}>();

const emit = defineEmits<{
  back: [];
  submit: [event: FormSubmitEvent<ReviewFormData>];
}>();

const form = defineModel<ReviewFormData>("form", { required: true });

const currentLocations = computed(() => {
  return props.selectedType === "АЗС" ? azsForSelect : ezsForSelect;
});
</script>

<template>
  <div class="flex flex-col grow">

    <!-- Шапка -->
    <div class="pt-12 pb-6 px-6 text-center border-b border-slate-100">
      <AppLogo
        :subtitle="selectedType === 'АЗС' ? 'Оцените обслуживание на АЗС' : 'Оцените зарядку на ЭЗС'"
      />
    </div>

    <UForm
      :schema="ReviewSchema"
      :state="form"
      @submit="emit('submit', $event)"
      class="flex flex-col gap-4 px-6 pt-6 pb-6 overflow-y-auto"
    >
      <!-- Стрелка назад + бейдж -->
      <div class="flex items-center gap-2 mb-1">
        <button
          type="button"
          @click="emit('back')"
          class="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
        >
          <UIcon name="line-md:arrow-left" class="text-xl" />
        </button>
        <span
          class="text-sm font-bold px-3 py-1 rounded-full"
          :class="selectedType === 'АЗС' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'"
        >
          {{ selectedType }}
        </span>
      </div>

      <UFormField name="location">
        <template #label>
          <span class="text-sm font-bold text-slate-700">Локация</span>
        </template>
        <USelectMenu
          :placeholder="`Выбор ${selectedType}`"
          icon="line-md:map-marker-twotone-loop"
          class="w-full"
          v-model="form.location"
          :items="currentLocations"
        />
      </UFormField>

      <UFormField name="fullName">
        <template #label>
          <span class="text-sm font-bold text-slate-700">ФИО</span>
        </template>
        <UInput
          icon="line-md:account"
          class="w-full"
          v-model="form.fullName"
          placeholder="Имя Фамилия Отчество"
        />
      </UFormField>

      <UFormField name="phone">
        <template #label>
          <span class="text-sm font-bold text-slate-700">Номер телефона</span>
        </template>
        <UInput
          icon="line-md:phone-call-twotone-loop"
          class="w-full"
          v-model="form.phone"
          v-maska="'+7 (###) ###-##-##'"
          placeholder="+7 (___) ___-__-__"
          type="tel"
        />
      </UFormField>

      <UFormField name="review">
        <template #label>
          <span class="text-sm font-bold text-slate-700">Комментарий</span>
        </template>
        <UTextarea
          class="w-full"
          v-model="form.review"
          placeholder="Что понравилось? Что можно улучшить?"
          :rows="5"
        />
      </UFormField>

      <UFormField name="rating">
        <StarRating
          v-model="form.rating"
          :disabled="submitted"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        color="error"
        :loading="loading"
        :disabled="loading || submitted"
        class="w-full py-5 rounded-2xl text-base font-black transition-all cursor-pointer mt-2"
        :class="submitted ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.97]'"
      >
        {{ submitted ? "✓ Отзыв отправлен" : loading ? "Отправляем..." : "Отправить отзыв →" }}
      </UButton>

    </UForm>
  </div>
</template>