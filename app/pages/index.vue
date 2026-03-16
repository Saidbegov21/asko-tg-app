<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { type ReviewFormData } from "~/schema/schema";

type StationType = "АЗС" | "ЭЗС" | null;

const selectedType = ref<StationType>(null);
const loading = ref(false);
const submitted = ref(false);
const telegramUser = ref<any>(null);
const telegramInitData = ref<string>("");

const form = ref<ReviewFormData>({
  station_type: "АЗС",
  location: "",
  fullName: "",
  phone: "",
  rating: 0,
  review: "",
});

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
        <StationSelect
          v-if="!selectedType"
          key="select"
          @select="selectType"
        />
        <ReviewForm
          v-else
          key="form"
          v-model:form="form"
          :selected-type="selectedType"
          :loading="loading"
          :submitted="submitted"
          @back="selectedType = null"
          @submit="onSubmit"
        />
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