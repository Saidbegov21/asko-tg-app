<script setup lang="ts">
import { vMaska } from "maska/vue";
import type { FormSubmitEvent } from "#ui/types";
import { ReviewSchema, type ReviewFormData } from "~/schema/schema";
import { locationsForSelect } from "~/schema/schema";

const form = reactive<ReviewFormData>({
  location: "",
  fullName: "",
  phone: "",
  review: "",
});

async function onSubmit(event: FormSubmitEvent<ReviewFormData>) {
  // Выполнится только если схема валидна
  console.log("Данные готовы к отправке:", event.data);
  alert("Форма успешно отправлена!");
}
</script>
<template>
  <UContainer class="m-4 max-w-md mx-auto">
    <UCard>
      <UForm
        ref="formRef"
        :schema="ReviewSchema"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Выберите заправочную станцию..."
          name="location"
          required
        >
          <USelectMenu
            placeholder="Выбор АЗС или ЭЗС"
            icon="line-md:map-marker-twotone-loop"
            class="w-full"
            v-model="form.location"
            :items="locationsForSelect"
          />
        </UFormField>
        <UFormField label="ФИО" name="fullName" required>
          <UInput
            icon="line-md:account"
            class="w-full"
            v-model="form.fullName"
            placeholder="Имя Фамилия"
          />
        </UFormField>

        <UFormField label="Номер телефона" name="phone" required>
          <UInput
            icon="line-md:phone-call-twotone-loop"
            class="w-full"
            v-model="form.phone"
            v-maska="'+7 (###) ###-##-##'"
            placeholder="+7 (___) ___-__-__"
            type="tel"
          />
        </UFormField>

        <UFormField label="Отзыв" name="review" required>
          <UTextarea
            class="w-full"
            v-model="form.review"
            placeholder="Что понравилось / что улучшить?"
            :rows="4"
          />
        </UFormField>

        <UButton type="submit" color="primary" block> Отправить отзыв </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
