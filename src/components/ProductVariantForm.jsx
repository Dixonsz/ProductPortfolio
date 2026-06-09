import PropTypes from "prop-types";
import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import ComboBox from "./ui/ComboBox";
import { productVariantSchema } from "../validations/rules";

function getSubmitLabel(isSubmitting, isEditing) {
  if (isSubmitting) return "Guardando...";
  if (isEditing) return "Actualizar";
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

function ProductVariantForm({
  onSubmit,
  defaultValues,
  onCancel,
  products,
  sizes,
  isProductDisabled,
}) {
  const isEditing = Boolean(defaultValues?.id);
  const [product, setProduct] = useState(defaultValues?.product_id ?? "");
  const [size, setSize] = useState(defaultValues?.size_id ?? "");
  const [code_hex, setCodeHex] = useState(defaultValues?.code_hex ?? "#000000");
  const [image_url, setImageUrl] = useState(defaultValues?.image_url || "");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const result = productVariantSchema.safeParse({
      product_id: product,
      size_id: size,
      code_hex,
      image_url,
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
        setProduct("");
        setSize("");
        setCodeHex("#000000");
        setImageUrl("");
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      <ComboBox
        id="product_id"
        label="Producto"
        placeholder="Selecciona un producto"
        options={mapOptions(products)}
        value={product}
        disabled={isSubmitting || isProductDisabled}
        error={fieldErrors.product_id}
        onChange={setProduct}
      />

      <ComboBox
        id="size_id"
        label="Tamaño"
        placeholder="Selecciona un tamaño"
        options={mapOptions(sizes)}
        value={size}
        disabled={isSubmitting}
        error={fieldErrors.size_id}
        onChange={setSize}
      />

      <div className="space-y-2">
        <label
          htmlFor="code_hex"
          className="block text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant"
        >
          Color
        </label>
        <div className="flex items-center gap-3 rounded-full border border-outline-variant/50 bg-surface-container-low px-4 py-3">
          <div
            className="relative h-11 w-11 overflow-hidden rounded-full border border-outline-variant/60 shadow-inner"
            style={{ backgroundColor: code_hex }}
          >
            <input
              id="code_hex"
              type="color"
              value={code_hex}
              disabled={isSubmitting}
              onChange={(event) => setCodeHex(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              aria-invalid={Boolean(fieldErrors.code_hex)}
              aria-describedby={fieldErrors.code_hex ? "code_hex-error" : undefined}
            />
          </div>
          <span className="text-body-md font-medium uppercase text-on-surface">
            {code_hex}
          </span>
        </div>
        {fieldErrors.code_hex && (
          <p id="code_hex-error" className="text-label-sm font-medium text-error">
            {fieldErrors.code_hex}
          </p>
        )}
      </div>

      <Input
        id="image_url"
        label="URL de la Imagen"
        placeholder="https://example.com/image.jpg"
        value={image_url}
        disabled={isSubmitting}
        error={fieldErrors.image_url}
        onChange={(event) => setImageUrl(event.target.value)}
      />

      {formError && (
        <p className="text-label-sm font-medium text-error">{formError}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={isEditing ? "save" : "add"}
        >
          {getSubmitLabel(isSubmitting, isEditing)}
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

ProductVariantForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  products: PropTypes.arrayOf(optionShape),
  sizes: PropTypes.arrayOf(optionShape),
  isProductDisabled: PropTypes.bool,
  defaultValues: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    code_hex: PropTypes.string,
    image_url: PropTypes.string,
  }),
};

ProductVariantForm.defaultProps = {
  onCancel: null,
  products: [],
  sizes: [],
  isProductDisabled: false,
  defaultValues: null,
};

export default ProductVariantForm;
