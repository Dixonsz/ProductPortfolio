import PropTypes from "prop-types";
import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import ComboBox from "./ui/ComboBox";
import { productSchema } from "../validations/rules";

function getSubmitLabel(isSubmitting, defaultValues) {
  if (isSubmitting) return "Guardando...";
  if (defaultValues) return "Actualizar";
  return "Crear";
}

function mapOptions(items) {
  return items.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
}

function getFieldErrors(issues) {
  return issues.reduce((errors, issue) => {
    const field = issue.path[0];
    if (field && !errors[field]) errors[field] = issue.message;
    return errors;
  }, {});
}

function ProductForm({
  onSubmit,
  defaultValues,
  onCancel,
  categories,
  brands,
  genders,
  states,
}) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [category, setCategory] = useState(
    defaultValues?.category_id ?? "",
  );
  const [brand, setBrand] = useState(
    defaultValues?.brand_id ?? "",
  );
  const [gender, setGender] = useState(
    defaultValues?.gender_id ?? "",
  );
  const [state, setState] = useState(
    defaultValues?.state_id ?? "",
  );
  const [description, setDescription] = useState(defaultValues?.description || "");
  const [price, setPrice] = useState(defaultValues?.price ?? "");
  const [isActive, setIsActive] = useState(defaultValues?.is_active ?? true);
  const [material, setMaterial] = useState(defaultValues?.material || "");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const result = productSchema.safeParse({
      name,
      category_id: category,
      brand_id: brand,
      gender_id: gender,
      state_id: state,
      description,
      price,
      is_active: isActive,
      material,
    });

    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error.issues));
      setFormError("");
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      await onSubmit(result.data);
      if (!defaultValues) {
        setName("");
        setCategory("");
        setBrand("");
        setGender("");
        setState("");
        setDescription("");
        setPrice("");
        setIsActive(true);
        setMaterial("");
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      <Input
        id="name"
        label="Nombre del producto"
        placeholder="Camiseta, pantalon, etc."
        value={name}
        disabled={isSubmitting}
        error={fieldErrors.name}
        onChange={(event) => setName(event.target.value)}
      />

      <ComboBox
        id="category_id"
        label="Categoria"
        placeholder="Selecciona una categoria"
        options={mapOptions(categories)}
        value={category}
        disabled={isSubmitting}
        error={fieldErrors.category_id}
        onChange={setCategory}
      />

      <ComboBox
        id="brand_id"
        label="Marca"
        placeholder="Selecciona una marca"
        options={mapOptions(brands)}
        value={brand}
        disabled={isSubmitting}
        error={fieldErrors.brand_id}
        onChange={setBrand}
      />

      <ComboBox
        id="gender_id"
        label="Genero"
        placeholder="Selecciona un genero"
        options={mapOptions(genders)}
        value={gender}
        disabled={isSubmitting}
        error={fieldErrors.gender_id}
        onChange={setGender}
      />

      <ComboBox
        id="state_id"
        label="Estado"
        placeholder="Selecciona un estado"
        options={mapOptions(states)}
        value={state}
        disabled={isSubmitting}
        error={fieldErrors.state_id}
        onChange={setState}
      />

      <Input
        id="description"
        label="Descripcion"
        placeholder="Descripcion del producto"
        value={description}
        disabled={isSubmitting}
        error={fieldErrors.description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <Input
        id="price"
        type="number"
        min="0"
        step="0.01"
        label="Precio "
        placeholder="0.00"
        value={price}
        disabled={isSubmitting}
        error={fieldErrors.price}
        onChange={(event) => setPrice(event.target.value)}
      />

      <Input
        id="material"
        label="Material"
        placeholder="Material del producto"
        value={material}
        disabled={isSubmitting}
        error={fieldErrors.material}
        onChange={(event) => setMaterial(event.target.value)}
      />

      <label className="flex items-center gap-3 rounded-full border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-body-md text-on-surface">
        <input
          type="checkbox"
          checked={isActive}
          disabled={isSubmitting}
          onChange={(event) => setIsActive(event.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        Producto activo
      </label>

      {formError && <p className="text-label-sm font-medium text-error">{formError}</p>}

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

const optionShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
});

ProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  categories: PropTypes.arrayOf(optionShape),
  brands: PropTypes.arrayOf(optionShape),
  genders: PropTypes.arrayOf(optionShape),
  states: PropTypes.arrayOf(optionShape),
  defaultValues: PropTypes.shape({
    name: PropTypes.string,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    brand_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    state_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image_url: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool,
    material: PropTypes.string,
  }),
};

ProductForm.defaultProps = {
  onCancel: null,
  categories: [],
  brands: [],
  genders: [],
  states: [],
  defaultValues: null,
};

export default ProductForm;
