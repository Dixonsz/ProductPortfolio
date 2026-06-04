import { useState } from "react";
import { categorySchema } from "../validations/categoryValidation";

function CategoryForm({ onSubmit, defaultValues, onCancel }) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const result = categorySchema.safeParse({ name });
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
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Nombre de la categoría:</label>
        <input
          id="name"
          type="text"
          placeholder="Ejemplo: Ropa Deportiva"
          value={name}
          disabled={isSubmitting}
          onChange={(event) => setName(event.target.value)}
        />
        {error && <span>{error}</span>}
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : defaultValues ? "Actualizar" : "Crear"}
        </button>
        {onCancel && (
          <button type="button" disabled={isSubmitting} onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default CategoryForm;
