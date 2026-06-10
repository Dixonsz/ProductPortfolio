import { z } from "zod/v4";

const emailField = z.string().trim().email("Email inválido");

const passwordField = z
  .string()
  .min(1, "La contraseña es requerida");

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});
