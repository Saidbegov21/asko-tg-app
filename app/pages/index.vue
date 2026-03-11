<script setup lang="ts">
import { vMaska } from "maska/vue";
import type { FormSubmitEvent } from "#ui/types";
import {
  ReviewSchema,
  type ReviewFormData,
  locationsForSelect,
} from "~/schema/schema";
import Logo from "../public/Logo.png";

const form = ref<ReviewFormData>({
  location: "",
  fullName: "",
  phone: "",
  review: "",
});

const loading = ref(false);
const telegramUser = ref<any>(null);
const telegramInitData = ref<string>("");

onMounted(() => {
  // Проверка на клиент + приведение к any для безопасности
  if (import.meta.client) {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      telegramUser.value = tg.initDataUnsafe?.user;
      telegramInitData.value = tg.initData;
    }
  }
});

const onSubmit = async (event: FormSubmitEvent<ReviewFormData>) => {
  loading.value = true;

  try {
    const tg = (window as any).Telegram?.WebApp;

    const response = await $fetch(
      "https://ffb74effa1e39f6b.mokky.dev/formdata",
      {
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
      },
    );

    if (tg) {
      tg.showPopup({ title: "Успех!", message: "Отзыв отправлен" });
      setTimeout(() => tg.close(), 1200);
    } else {
      alert("Отзыв успешно отправлен!");
    }
  } catch (error: any) {
    const tg = (window as any).Telegram?.WebApp;
    const message = error.data?.message || "Ошибка отправки";

    if (tg) {
      tg.showPopup({ title: "Ошибка", message });
    } else {
      alert(`Ошибка: ${message}`);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UContainer class="overflow-hidden m-4 max-w-md mx-auto">
    <UForm :schema="ReviewSchema" :state="form" @submit="onSubmit">
      <UCard color variant="subtle" class="h-full">
        <template #header>
          <img class="w-40 mx-auto" :src="Logo" alt="Logo" />
        </template>

        <UFormField label="Выберите заправочную станцию..." name="location">
          <USelectMenu
            placeholder="Выбор АЗС или ЭЗС"
            icon="line-md:map-marker-twotone-loop"
            class="w-full"
            v-model="form.location"
            :items="locationsForSelect"
          />
        </UFormField>

        <UFormField label="ФИО" name="fullName">
          <UInput
            icon="line-md:account"
            class="w-full"
            v-model="form.fullName"
            placeholder="Имя Фамилия"
          />
        </UFormField>

        <UFormField label="Номер телефона" name="phone">
          <UInput
            icon="line-md:phone-call-twotone-loop"
            class="w-full"
            v-model="form.phone"
            v-maska="'+7 (###) ###-##-##'"
            placeholder="+7 (___) ___-__-__"
            type="tel"
          />
        </UFormField>

        <UFormField label="Отзыв" name="review">
          <UTextarea
            icon="line-md:chat-filled"
            class="w-full"
            v-model="form.review"
            placeholder="Что понравилось / что улучшить?"
            :rows="4"
          />
        </UFormField>

        <template #footer>
          <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
            :disabled="loading"
          >
            Отправить отзыв
          </UButton>
        </template>
      </UCard>
    </UForm>
  </UContainer>
</template>
