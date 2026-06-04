import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres'),
})
