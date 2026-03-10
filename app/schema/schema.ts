import { z } from "zod";

export const locationsArray = [
  "Аско№1 Улица Шамиля 39",
  "Аско№2 Улица батырая 39",
  "Аско№3 Улица гагарина 39",
  "Аско№4 Улица Гамидова 39",
] as const;

// Тип для проверки (извлекаем строки из массива)
type Location = (typeof locationsArray)[number];

export const locationsForSelect = [...locationsArray] as string[];

export const ReviewSchema = z.object({
  // 1. Сначала проверяем, что это строка и она не пустая
  // 2. Затем проверяем, входит ли она в наш список
  location: z
    .string()
    .min(1, "Пожалуйста, выберите заправочную станцию")
    .refine((val) => locationsArray.includes(val as Location), {
      message: "Выбранная станция не существует",
    }),

  fullName: z
    .string()
    .min(3, "ФИО минимум 3 символа")
    .max(100, "ФИО слишком длинное")
    .regex(/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/, "Имя может содержать только буквы"),

  phone: z
    .string()
    .regex(
      /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      "Неверный формат. Используйте: +7 (XXX) XXX-XX-XX",
    ),

  review: z
    .string()
    .min(10, "Отзыв минимум 10 символов")
    .max(200, "Отзыв слишком длинный"),
});

export type ReviewFormData = z.infer<typeof ReviewSchema>;
