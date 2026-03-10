<script setup lang="ts">
import { vMaska } from "maska/vue";
import type { FormSubmitEvent } from "#ui/types";
import { ReviewSchema, type ReviewFormData } from "~/schema/schema";
import { locationsForSelect } from "~/schema/schema";
import Logo from "../public/Logo.png"


const form = reactive<ReviewFormData>({
  location: "",
  fullName: "",
  phone: "",
  review: "",
});

const onSubmit = async (event: FormSubmitEvent<ReviewFormData>) => {
  // 1. Безопасный доступ к Telegram WebApp (проверка на клиентскую среду)
  const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
  
  // 2. Извлекаем данные пользователя
  const user = tg?.initDataUnsafe?.user;

  try {
    // 3. Выполнение POST-запроса через базовый $fetch
    const response = await $fetch('https://ffb74effa1e39f6b.mokky.dev/formdata', {
      method: 'POST',
      body: {
        ...event.data,
        telegram: {
          username: user?.username || "none",
          user_id: user?.id,
          first_name: user?.first_name
        },
        initData: tg?.initData 
      }
    });

    // 4. Логика при успехе
    console.log("Успешно отправлено:", response);
    alert("Отзыв успешно отправлен!");

    tg?.close();

  } catch (error: any) {
    console.error("Ошибка при запросе:", error);
    alert(`Ошибка: ${error.statusText || 'Не удалось отправить форму'}`);
  }
};
</script>
<template>
  <UContainer class="overflow-hidden m-4 max-w-md mx-auto">
    <UForm
      ref="formRef"
      :schema="ReviewSchema"
      :state="form"
      @submit="onSubmit"
    >
      <UCard color variant="subtle" class="h-full"">
        <template #header>
          <img class="w-40 mx-auto" :src="Logo" alt="">
        </template>
        <UFormField
          class="pt-4"
          label="Выберите заправочную станцию..."
          name="location"
        >
          <USelectMenu
            placeholder="Выбор АЗС или ЭЗС"
            icon="line-md:map-marker-twotone-loop"
            class="w-full"
            v-model="form.location"
            :items="locationsForSelect"
          />
        </UFormField>
        <UFormField class="pt-4" label="ФИО" name="fullName">
          <UInput
            icon="line-md:account"
            class="w-full"
            v-model="form.fullName"
            placeholder="Имя Фамилия"
          />
        </UFormField>

        <UFormField class="pt-4" label="Номер телефона" name="phone">
          <UInput
            icon="line-md:phone-call-twotone-loop"
            class="w-full"
            v-model="form.phone"
            v-maska="'+7 (###) ###-##-##'"
            placeholder="+7 (___) ___-__-__"
            type="tel"
          />
        </UFormField>

        <UFormField class="pt-4" label="Отзыв" name="review">
          <UTextarea
          icon="line-md:chat-filled"
            class="w-full"
            v-model="form.review"
            placeholder="Что понравилось / что улучшить?"
            :rows="4"
          />
        </UFormField>
        <template #footer>
          <UButton type="submit" color="primary" block>
            Отправить отзыв
          </UButton>
        </template>
      </UCard>
    </UForm>
  </UContainer>
</template>
