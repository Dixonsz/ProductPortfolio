import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { loginSchema } from "../validations/authRules";

const initialValues = {
  email: "",
  password: "",
};

function getValidationErrors(error) {
  return error.issues.reduce((errors, issue) => {
    const field = issue.path[0];

    if (field) {
      errors[field] = issue.message;
    }

    return errors;
  }, {});
}

export default function LoginPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from?.pathname ?? "/";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
      root: undefined,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = loginSchema.safeParse(values);

    if (!validation.success) {
      setErrors(getValidationErrors(validation.error));
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(validation.data.email, validation.data.password);
      navigate(redirectTo, { replace: true });
    } catch {
      setErrors({
        root: "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-6 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm lg:grid-cols-[1fr_420px]">
        <div className="flex min-h-[520px] flex-col justify-between bg-primary px-8 py-10 text-on-primary lg:px-12">
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-widest text-on-primary/75">
              Catálogo en Línea 
            </p>
            <h1 className="mt-5 max-w-xl font-display text-headline-lg">
              Amar y Ya
            </h1>
          </div>

          <div className="grid gap-4 text-on-primary/85 sm:grid-cols-3 lg:grid-cols-1">
            {["Inventario", "Categorías", "Variantes"].map((item) => (
              <div key={item} className="border-t border-on-primary/20 pt-4">
                <span className="text-label-sm font-semibold uppercase tracking-widest">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-6 px-8 py-10 lg:px-10"
        >
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">
              Acceso
            </p>
            <h2 className="mt-2 font-display text-headline-md text-on-surface">
              Iniciar sesión
            </h2>
          </div>

          <div className="space-y-5">
            <Input
              id="email"
              name="email"
              type="email"
              label="Correo electrónico"
              placeholder="correo@empresa.com"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              disabled={isSubmitting}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

          {errors.root && (
            <p className="rounded-lg bg-error-container px-4 py-3 text-label-sm font-semibold text-on-error-container">
              {errors.root}
            </p>
          )}

          <Button
            type="submit"
            icon="login"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>
      </section>
    </main>
  );
}
