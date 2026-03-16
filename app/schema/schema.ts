import { z } from "zod";

export const azsLocations = [
  "Аско АЗС№1 Улица Шамиля 39",
  "Аско АЗС№2 Улица Батырая 39",
  "Аско АЗС№3 Улица Гагарина 39",
  "Аско АЗС№4 Улица Гамидова 39",
] as const;

export const ezsLocations = [
  "Аско ЭЗС№1 Улица Шамиля 39",
  "Аско ЭЗС№2 Улица Батырая 39",
] as const;

export const allLocations = [...azsLocations, ...ezsLocations] as const;

type Location = (typeof allLocations)[number];

export const azsForSelect = [...azsLocations] as string[];
export const ezsForSelect = [...ezsLocations] as string[];

export const ReviewSchema = z.object({
  station_type: z.enum(["АЗС", "ЭЗС"] as const, {
  error: "Выберите тип станции",
}),

  location: z
    .string()
    .min(1, "Пожалуйста, выберите заправочную станцию")
    .refine((val) => allLocations.includes(val as Location), {
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

  rating: z
    .number( "Пожалуйста, поставьте оценку")
    .min(1, "Пожалуйста, поставьте оценку")
    .max(5),

  review: z
    .string()
    .min(10, "Отзыв минимум 10 символов")
    .max(200, "Отзыв слишком длинный"),
});

export type ReviewFormData = z.infer<typeof ReviewSchema>;