<script setup lang="ts">
import { vMaska } from "maska/vue";
import type { FormSubmitEvent } from "#ui/types";
import {
  ReviewSchema,
  type ReviewFormData,
  locationsForSelect,
} from "~/schema/schema";

const form = ref<ReviewFormData>({
  location: "",
  fullName: "",
  phone: "",
  rating: 0,
  review: "",
});

const hoveredStar = ref(0);
const loading = ref(false);
const submitted = ref(false);
const telegramUser = ref<any>(null);
const telegramInitData = ref<string>("");

onMounted(() => {
  if (import.meta.client) {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      telegramUser.value = tg.initDataUnsafe?.user;
      telegramInitData.value = tg.initData;
    }
  }
});

const setRating = (star: number) => {
  form.value.rating = star;
};

const ratingLabel = computed(() => {
  const labels: Record<number, string> = {
    1: "Очень плохо",
    2: "Плохо",
    3: "Нормально",
    4: "Хорошо",
    5: "Отлично!",
  };
  const active = hoveredStar.value || form.value.rating;
  return active ? labels[active] : "Поставьте оценку";
});

const onSubmit = async (event: FormSubmitEvent<ReviewFormData>) => {
  if (submitted.value) return;
  loading.value = true;
  try {
    await $fetch("https://ffb74effa1e39f6b.mokky.dev/formdata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        ...event.data,
        telegram: {
          id: telegramUser.value?.id,
          username: telegramUser.value?.username,
          first_name: telegramUser.value?.first_name,
        },
        initData: telegramInitData.value,
      },
    });

    submitted.value = true;
  } catch (error: any) {
    const message =
      error?.data?.message || "Ошибка отправки. Попробуйте снова.";
    alert(`Ошибка: ${message}`);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex justify-center">
    <div class="w-full max-w-md bg-white min-h-screen flex flex-col px-5 py-8">
      <div
        class="flex flex-col items-center pb-6 mb-2 border-b border-gray-100"
      >
        <img src="/Logo.png" alt="АСКО" class="w-44 object-contain mb-2" />
        <p class="text-md font-semibold text-gray-800 tracking-wide">
          Оставьте отзыв о нашей заправке
        </p>
      </div>

      <UForm
        :schema="ReviewSchema"
        :state="form"
        @submit="onSubmit"
        class="flex flex-col gap-4 mt-5"
      >
        <UFormField name="location">
          <template #label>
            <span class="text-sm font-semibold text-gray-800"
              >Заправочная станция</span
            >
          </template>
          <USelectMenu
            placeholder="Выбор АЗС или ЭЗС"
            icon="line-md:map-marker-twotone-loop"
            class="w-full"
            v-model="form.location"
            :items="locationsForSelect"
          />
        </UFormField>

        <UFormField name="fullName">
          <template #label>
            <span class="text-sm font-semibold text-gray-800">ФИО</span>
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
            <span class="text-sm font-semibold text-gray-800"
              >Номер телефона</span
            >
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
            <span class="text-sm font-semibold text-gray-800">Ваш отзыв</span>
          </template>
          <UTextarea
            class="w-full"
            v-model="form.review"
            placeholder="Что понравилось? Что можно улучшить?"
            :rows="4"
          />
        </UFormField>

        <UFormField name="rating">
          <div class="flex flex-col items-center gap-2 py-4 transition-colors">
            <div class="flex gap-1">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="setRating(star)"
                @mouseenter="hoveredStar = star"
                @mouseleave="hoveredStar = 0"
                class="text-5xl transition-all duration-100 active:scale-90 cursor-pointer select-none leading-none"
                :disabled="submitted"
              >
                <span
                  :class="
                    star <= (hoveredStar || form.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-200'
                  "
                  >★</span
                >
              </button>
            </div>
            <span
              class="text-sm font-medium transition-colors"
              :class="form.rating ? 'text-yellow-500' : 'text-red-400'"
            >
              {{ ratingLabel }}
            </span>
          </div>
        </UFormField>

        <div class="mt-2">
          <UButton
            type="submit"
            block
            :loading="loading"
            :disabled="loading || submitted"
            color="error"
            class="w-full py-4 rounded-2xl text-base font-bold tracking-wide transition-all cursor-pointer"
            :class="
              submitted
                ? 'opacity-60 cursor-not-allowed'
                : 'shadow-lg shadow-red-200 active:scale-95'
            "
          >
            {{
              submitted
                ? "✓ Отзыв отправлен"
                : loading
                  ? "Отправляем..."
                  : "Отправить отзыв"
            }}
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>
