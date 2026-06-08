import { z } from 'zod'

export const nameField = z
  .string()
  .trim()
  .min(1, 'El nombre es requerido')
  .max(100, 'El nombre no puede superar los 100 caracteres')
  .transform((val) =>
    val.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  )

export const emailField = z
  .string()
  .trim()
  .email('Email inválido')

export const requiredString = z
  .string()
  .trim()
  .min(1, 'Este campo es requerido')

export const hexField = z
  .string()
  .trim()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Color hex inválido')

  export const categorySchema = z.object({
    name: nameField,
  })

  export const brandSchema = z.object({
    name: nameField,
  })

export const genderSchema = z.object({
  name: nameField,
})

export const stateSchema = z.object({
  name: nameField,
})

export const sizeSchema = z.object({
  name: nameField,
})

export const colorSchema = z.object({
  name: nameField,
  hex_code: hexField,
})

export const productSchema = z.object({
  category_id: z.number().int().positive('ID de categoría inválido'),
  brand_id: z.number().int().positive('ID de marca inválido'),
  gender_id: z.number().int().positive('ID de género inválido'),
  state_id: z.number().int().positive('ID de estado inválido'),
  image_url: z.string().url('URL de imagen inválida'),
  description: z.string().trim().min(1, 'La descripción es requerida'),
  price: z.number().positive('El precio debe ser un número positivo'),
  is_acticve: z.boolean(),
  material: z.string().trim().min(1, 'El material es requerido'),
})