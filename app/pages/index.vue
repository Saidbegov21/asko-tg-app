<script setup lang="ts">
import { z } from 'zod'
import { vMaska } from 'maska/vue'

// Zod-схема для всех полей
const schema = z.object({
  fullName: z.string('Укажите ФИО')
    .min(3, 'ФИО минимум 3 символа')
    .max(100, 'ФИО слишком длинное'),

  phone: z.string('Укажите номер телефона')
    .regex(
      /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      'Неверный формат. Используйте: +7 (XXX) XXX-XX-XX'
    ),

  review: z.string('Напишите отзыв')
    .min(10, 'Отзыв минимум 20 символов')
    .max(200, 'Отзыв слишком длинный')
})

// Тип формы
type FormData = z.infer<typeof schema>

// Состояние
const form = reactive<Partial<FormData>>({
  fullName: '',
  phone: '',
  review: ''
})

// Ошибки
const errors = reactive({
  fullName: '',
  phone: '',
  review: ''
})

// Валидация формы
const validateForm = () => {
  // Сбрасываем ошибки
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  const result = schema.safeParse(form)

  if (result.success) {
    return true
  }

  // Заполняем ошибки
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof typeof errors
    if (field && errors[field] !== undefined) {
      errors[field] = issue.message
    }
  })

  return false
}

// Computed — форма валидна?
const isFormValid = computed(() => {
  return Object.values(errors).every(err => err === '')
})

// Отправка
const submit = async () => {
  if (!validateForm()) return

  console.log('Форма валидна! Отправляем:', form)
  // await $fetch('/api/review', { method: 'POST', body: form })
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <UForm>
      <UFormField
        label="ФИО"
        required
      >
        <UInput
          v-model="form.fullName"
          placeholder="Имя Фамилия"
        />
        <p
          v-if="errors.fullName"
          class="text-red-500 text-xs mt-1"
        >
          {{ errors.fullName }}
        </p>
      </UFormField>

      <UFormField
        label="Номер телефона"
        required
      >
        <UInput
          v-model="form.phone"
          v-maska
          data-maska="+7 (###) ###-##-##"
          placeholder="+7 (___) ___-__-__"
          type="tel"
        />
        <p
          v-if="errors.phone"
          class="text-red-500 text-xs mt-1"
        >
          {{ errors.phone }}
        </p>
      </UFormField>

      <UFormField
        label="Отзыв"
        required
      >
        <UTextarea
          v-model="form.review"
          placeholder="Что понравилось / что улучшить?"
          :rows="4"
        />
        <p
          v-if="errors.review"
          class="text-red-500 text-xs mt-1"
        >
          {{ errors.review }}
        </p>
      </UFormField>

      <UButton
        color="primary"
        block
        :disabled="!isFormValid"
        @click="submit"
      >
        Отправить отзыв
      </UButton>
    </UForm>
  </div>
</template>
