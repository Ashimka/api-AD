import z from 'zod';

export const idParamsSchema = z.object({
  id: z.string().regex(/^c[\da-z]{24}$/, 'Некорректный id записи'),
});
export const idCarsParamsSchema = z.object({
  carId: z.string().regex(/^c[\da-z]{24}$/, 'Некорректный id втомобиля'),
});

export const createPostCarSchema = z.object({
  type: z
    .string({ message: 'Тип записи обязателен' })
    .min(1, 'Тип записи не может быть пустым')
    .max(100, 'Тип записи слишком длинный'),

  description: z
    .string()
    .min(4, 'Описание не может быть пустым')
    .max(1000, 'Описание слишком длинное')
    .nullable()
    .optional(),

  cost: z
    .number()
    .min(0, 'Цена не может быть отрицательной')
    .nullable()
    .optional(),

  userCarDataId: z
    .string()
    .regex(/^c[\da-z]{24}$/, 'Некорректный id автомобиля'),
});

export const updatePostCarSchema = createPostCarSchema.partial().omit({
  userCarDataId: true,
});
