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
  .email('Email invalido')

export const requiredString = z
  .string()
  .trim()
  .min(1, 'Este campo es requerido')

export const hexField = z
  .string()
  .trim()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Color hex invalido')

const positiveNumberField = (message) =>
  z.preprocess((value) => {
    const numberValue = Number(value)
    return Number.isNaN(numberValue) ? 0 : numberValue
  }, z.number().positive(message))

const requiredIdField = (message) =>
  z.preprocess((value) => {
    if (value === null || value === undefined) return ''
    return String(value).trim()
  }, z.string().min(1, message)).transform((value) => {
    if (/^\d+$/.test(value)) return Number(value)
    return value
  })

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

export const productSchema = z.object({
  name: nameField,
  category_id: requiredIdField('Selecciona una categoria'),
  brand_id: requiredIdField('Selecciona una marca'),
  gender_id: requiredIdField('Selecciona un genero'),
  state_id: requiredIdField('Selecciona un estado'),
  description: z.string().trim().min(1, 'La descripcion es requerida'),
  price: positiveNumberField('El precio debe ser un numero positivo'),
  is_active: z.boolean(),
  material: z.string().trim().min(1, 'El material es requerido'),
})
