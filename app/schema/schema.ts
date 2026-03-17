import { z } from "zod";

export const azsLocations = [
  "Аско АЗС№1 Улица Шамиля 39",
  "Аско АЗС№2 Улица Батырая 39",
  "Аско АЗС№3 Улица Гагарина 39",
  "Аско АЗС№4 Улица Гамидова 39",
] as const;

export const ezsLocations = [
  "ЭЗС: 1/3 (Е13) Центр",
  "ЭЗС: 2/3 (E13) Центр",
  "ЭЗС: 3/3 (E13) Центр",
  "ЭЗС: 10/1 (E13) Степной",
  "ЭЗС: 10/2 (E13) Степной",
  "ЭЗС: 10/3 (Е13) Степной",
  "ЭЗС: 10/4 (Е13) Степной",
  "ЭЗС: 10/5 (Е13) Степной",
  "ЭЗС: 7/1 80кВт 05.Ру",
  "ЭЗС: 7/2 60кВт. 05.Ру",
  "ЭЗС: 6/1 (E13) Шива",
  "ЭЗС: 6/2 Шива DC150",
  "ЭЗС: 5 Киргу DC120",
  "ЭЗС: 21/1 Хас DC150",
  "ЭЗС: 21/2 (E13) Хас",
  "ЭЗС: 12/1 Изберг DC150",
  "ЭЗС: 12/2 (E13) Изберг",
  "ЭЗС: 11/1 Парнас DC150",
  "ЭЗС: 11/2 (E13) Парнас",
  "ЭЗС: 14 Каякент зелен DC240",
  "ЭЗС: 15 Каякент красн DC150",
  "ЭЗС: 3 Манас А3 DC150",
  "ЭЗС: Гостиница Аскал",
  "ЭЗС: Арани 1/1 40кВт",
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
    .number("Пожалуйста, поставьте оценку")
    .min(1, "Пожалуйста, поставьте оценку")
    .max(5),

  review: z
    .string()
    .min(10, "Отзыв минимум 10 символов")
    .max(200, "Отзыв слишком длинный"),

  consent: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласие на обработку данных",
  }),
});

export type ReviewFormData = z.infer<typeof ReviewSchema>;
