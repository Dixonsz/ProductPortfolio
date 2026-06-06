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
