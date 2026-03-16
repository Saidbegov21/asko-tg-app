<script setup lang="ts">
import { vMaska } from "maska/vue";
import type { FormSubmitEvent } from "#ui/types";
import { Fuel, Zap } from "lucide-vue-next";
import {
  ReviewSchema,
  type ReviewFormData,
  azsForSelect,
  ezsForSelect,
} from "~/schema/schema";

type StationType = "АЗС" | "ЭЗС" | null;

const selectedType = ref<StationType>(null);

const form = ref<ReviewFormData>({
  station_type: "АЗС",
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
      tg.expand();
      telegramUser.value = tg.initDataUnsafe?.user;
      telegramInitData.value = tg.initData;
    }
  }
});

const selectType = (type: StationType) => {
  selectedType.value = type;
  form.value.station_type = type!;
  form.value.location = "";
};

const currentLocations = computed(() => {
  return selectedType.value === "АЗС" ? azsForSelect : ezsForSelect;
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
    const tg = (window as any).Telegram?.WebApp;
    await $fetch("https://review.asko-plus.ru/review/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        ...event.data,
        telegram: {
          id: telegramUser.value?.id,
          username: telegramUser.value?.username,
        },
        initData: telegramInitData.value,
      },
    });

    submitted.value = true;

    if (tg) {
      setTimeout(() => tg.close(), 1000);
    } else {
      alert("Отзыв успешно отправлен!");
    }
  } catch (error: any) {
    const message = error?.data?.message || "Ошибка отправки. Попробуйте снова.";
    alert(`Ошибка: ${message}`);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
    <div class="w-full max-w-120 min-h-screen sm:min-h-212.5 sm:rounded-[40px] shadow-2xl overflow-hidden bg-white flex flex-col">

      <Transition name="fade" mode="out-in">

        <!-- Экран выбора типа станции -->
        <div v-if="!selectedType" key="select" class="flex flex-col grow items-center justify-center px-6 py-12 gap-8">

          <!-- Шапка -->
          <div class="text-center">
            <div class="flex justify-center mb-2">
              <div class="flex items-baseline italic">
                <span class="text-red-600 text-4xl font-black tracking-tighter">A</span>
                <span class="text-red-600 text-3xl font-black tracking-tighter">sko</span>
                <div class="w-1.5 h-1.5 bg-red-600 ml-1 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p class="text-sm font-bold uppercase tracking-widest text-slate-400">
              Оставьте отзыв
            </p>
          </div>

          <!-- Заголовок и карточки -->
          <div class="flex flex-col gap-5 w-full">
            <div class="text-center">
              <h2 class="text-2xl font-black text-slate-900 tracking-tight">Выберите тип станции</h2>
              <p class="text-sm text-slate-400 mt-1">Мы подготовим список адресов для вас</p>
            </div>

            <!-- АЗС -->
            <button
              type="button"
              @click="selectType('АЗС')"
              class="flex items-center p-7 border-2 border-slate-100 rounded-4xl bg-white hover:border-red-500 shadow-xl shadow-slate-200/50 transition-all active:scale-95 group cursor-pointer w-full"
            >
              <div class="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                <Fuel :size="32" :stroke-width="2.5" />
              </div>
              <div class="ml-6 text-left">
                <div class="font-black text-2xl tracking-tight text-slate-900">АЗС</div>
                <div class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Классическое топливо</div>
              </div>
            </button>

            <!-- ЭЗС -->
            <button
              type="button"
              @click="selectType('ЭЗС')"
              class="flex items-center p-7 border-2 border-slate-100 rounded-4xl bg-white hover:border-blue-500 shadow-xl shadow-slate-200/50 transition-all active:scale-95 group cursor-pointer w-full"
            >
              <div class="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Zap :size="32" :stroke-width="2.5" />
              </div>
              <div class="ml-6 text-left">
                <div class="font-black text-2xl tracking-tight text-slate-900">ЭЗС</div>
                <div class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Электрозарядка</div>
              </div>
            </button>
          </div>

        </div>

        <!-- Экран формы -->
        <div v-else key="form" class="flex flex-col grow">

          <!-- Шапка формы -->
          <div class="pt-12 pb-6 px-6 text-center border-b border-slate-100">
            <div class="flex justify-center mb-2">
              <div class="flex items-baseline italic">
                <span class="text-red-600 text-4xl font-black tracking-tighter">A</span>
                <span class="text-red-600 text-3xl font-black tracking-tighter">sko</span>
                <div class="w-1.5 h-1.5 bg-red-600 ml-1 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p class="text-sm text-slate-400 font-medium">
              {{ selectedType === 'АЗС' ? 'Оцените обслуживание на АЗС' : 'Оцените зарядку на ЭЗС' }}
            </p>
          </div>

          <!-- Форма с отступом от шапки -->
          <UForm
            :schema="ReviewSchema"
            :state="form"
            @submit="onSubmit"
            class="flex flex-col gap-4 px-6 pt-6 pb-6 overflow-y-auto"
          >
            <!-- Стрелка назад + бейдж -->
            <div class="flex items-center gap-2 mb-1">
              <button
                type="button"
                @click="selectedType = null"
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
                :rows="3"
              />
            </UFormField>

            <UFormField name="rating">
              <div class="rounded-3xl bg-slate-50 p-6 flex flex-col items-center gap-3">
                <div class="flex gap-1">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    @click="setRating(star)"
                    @mouseenter="hoveredStar = star"
                    @mouseleave="hoveredStar = 0"
                    :disabled="submitted"
                    class="transition-transform hover:scale-110 active:scale-75 cursor-pointer select-none"
                  >
                    <span
                      class="text-4xl leading-none transition-all duration-200"
                      :class="star <= (hoveredStar || form.rating) ? 'text-yellow-400' : 'text-slate-200'"
                    >★</span>
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

      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>