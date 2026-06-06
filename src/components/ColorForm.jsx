import propTypes from "prop-types";
import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { colorSchema } from "../validations/rules";

function getSubmitLabel(isSubmitting, defaultValues) {
  if (isSubmitting) return "Guardando...";
  if (defaultValues) return "Actualizar";
  return "Crear";
}

function ColorForm({ onSubmit, defaultValues, onCancel }) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [hex_code, setHex_code] = useState(
    defaultValues?.hex_code || "#ffffff",
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const result = colorSchema.safeParse({ name, hex_code });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Datos inválidos");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(result.data);
      if (!defaultValues) {
        setName("");
        setHex_code("#ffffff");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      <Input
        id="name"
        label="Nombre del color"
        placeholder="Rojo brillante"
        value={name}
        disabled={isSubmitting}
        error={error}
        onChange={(event) => setName(event.target.value)}
      />

      <div className="space-y-2">
        <label
          htmlFor="hex_code"
          className="block text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant"
        >
          Color
        </label>
        <div className="flex items-center gap-3 rounded-full border border-outline-variant/50 bg-surface-container-low px-3 py-2 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
          <div className="relative h-10 w-10 shrink-0">
            <span
              className="absolute inset-0 rounded-full border border-outline-variant/60 shadow-sm"
              style={{ backgroundColor: hex_code }}
              aria-hidden="true"
            />
            <input
              id="hex_code"
              type="color"
              value={hex_code}
              disabled={isSubmitting}
              onChange={(event) => setHex_code(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              aria-label="Seleccionar color"
            />
          </div>
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
            {hex_code}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={defaultValues ? "save" : "add"}
        >
          {getSubmitLabel(isSubmitting, defaultValues)}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

ColorForm.propTypes = {
  onSubmit: propTypes.func.isRequired,
  onCancel: propTypes.func,
  defaultValues: propTypes.shape({
    name: propTypes.string,
    hex_code: propTypes.string,
  }),
};

ColorForm.defaultProps = {
  onCancel: null,
  defaultValues: null,
};

export default ColorForm;
