import propTypes from "prop-types";
import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { genderSchema } from "../validations/rules";


function getSubmitLabel(isSubmitting, defaultValues) {
  if (isSubmitting) return "Guardando...";
  if (defaultValues) return "Actualizar";
  return "Crear";
}

function GenderForm({ onSubmit, defaultValues, onCancel }) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const result = genderSchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Datos inválidos");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(result.data);
      if (!defaultValues) setName("");
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
        label="Nombre del género"
        placeholder="Masculino, Femenino, etc."
        value={name}
        disabled={isSubmitting}
        error={error}
        onChange={(event) => setName(event.target.value)}
      />

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

GenderForm.propTypes = {
  onSubmit: propTypes.func.isRequired,
  onCancel: propTypes.func,
  defaultValues: propTypes.shape({
    name: propTypes.string,
  }),
};

GenderForm.defaultProps = {
  onCancel: null,
  defaultValues: null,
};

export default GenderForm;
