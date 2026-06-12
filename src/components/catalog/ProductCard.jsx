import PropTypes from "prop-types";
import { useMemo, useState } from "react";

function formatCurrency(value) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 2,
  }).format(Number.isNaN(amount) ? 0 : amount);
}

function getVariantColor(variant) {
  return variant.code_hex || variant.hex || "#c5c8be";
}

function getPrimaryImage(variants = []) {
  return variants.find((variant) => variant.imagePublicUrl)?.imagePublicUrl ?? null;
}

function getSizeName(variant) {
  return variant.size?.name ?? variant.size_name ?? "Sin talla";
}

function getUniqueColorVariants(variants = []) {
  const colorsByHex = new Map();

  variants.forEach((variant) => {
    const hex = getVariantColor(variant).toLowerCase();
    const current = colorsByHex.get(hex);

    if (!current) {
      colorsByHex.set(hex, {
        hex,
        imagePublicUrl: variant.imagePublicUrl,
        sizes: [getSizeName(variant)],
      });
      return;
    }

    if (!current.imagePublicUrl && variant.imagePublicUrl) {
      current.imagePublicUrl = variant.imagePublicUrl;
    }

    const sizeName = getSizeName(variant);
    if (!current.sizes.includes(sizeName)) current.sizes.push(sizeName);
  });

  return Array.from(colorsByHex.values());
}

function InfoItem({ icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2">
      <span className="material-symbols-outlined shrink-0 text-[18px] text-primary" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-on-surface">{value}</p>
      </div>
    </div>
  );
}

function DetailTag({ label, value }) {
  if (!value) return null;

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/70">
        {label}
      </p>
      <p className="mt-1 truncate text-sm text-on-surface">{value}</p>
    </div>
  );
}

function ProductImage({ src, alt, fit = "cover" }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-container">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40" aria-hidden="true">
          image
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      loading="lazy"
      decoding="async"
      className={`h-full w-full ${
        fit === "contain" ? "object-contain p-3" : "object-cover"
      } transition duration-300 group-hover:scale-[1.02]`}
    />
  );
}

function ColorSelector({ colors, activeIndex, onSelect }) {
  if (colors.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label="Colores disponibles">
      {colors.map((color, index) => (
        <button
          key={color.hex}
          type="button"
          onClick={() => onSelect(index)}
          className={`h-8 w-8 rounded-full border transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
            activeIndex === index
              ? "border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-surface-container-lowest"
              : "border-outline-variant/70"
          }`}
          style={{ backgroundColor: color.hex }}
          title={`Color ${color.hex}`}
          aria-label={`Seleccionar color ${color.hex}`}
          aria-pressed={activeIndex === index}
        />
      ))}
    </div>
  );
}

function VariantSummary({ color, totalVariants, compact = false }) {
  if (!color) {
    return (
      <div className="rounded-lg border border-dashed border-outline-variant/60 px-3 py-2 text-sm text-on-surface-variant">
        Este producto aun no tiene variantes registradas.
      </div>
    );
  }

  return (
    <div className={`${compact ? "space-y-1 px-3 py-2" : "space-y-2 px-3 py-3"} rounded-lg border border-outline-variant/30`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
          Variantes
        </p>
        <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-label-sm font-semibold text-on-primary-container">
          {totalVariants}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {color.sizes.map((size) => (
          <span
            key={size}
            className="rounded-full bg-surface-container px-2.5 py-1 text-label-sm font-semibold text-on-surface"
          >
            {size}
          </span>
        ))}
      </div>
    </div>
  );
}

function CardAction({ icon, label, onClick, variant = "primary" }) {
  if (!onClick) return null;

  const classes =
    variant === "primary"
      ? "bg-primary text-on-primary hover:bg-primary/90"
      : "bg-surface-container text-on-surface hover:bg-surface-container-high";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-label-sm font-semibold uppercase tracking-widest transition ${classes}`}
    >
      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
        {icon}
      </span>
      {label}
    </button>
  );
}

function ProductCard({
  product,
  onEdit,
  onManageVariants,
  featured = false,
  compact = false,
  imageFit = "cover",
}) {
  const {
    name,
    brand,
    category,
    gender,
    state,
    description,
    material,
    price,
    variants = [],
  } = product;
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const colorVariants = useMemo(() => getUniqueColorVariants(variants), [variants]);
  const activeColor = colorVariants[activeColorIndex] ?? colorVariants[0];
  const activeImage = activeColor?.imagePublicUrl ?? getPrimaryImage(variants);
  const isActive = product.is_active ?? true;

  return (
    <article
      className={`group relative overflow-hidden bg-surface-container-low transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 ${
        featured ? "xl:col-span-2 xl:row-span-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-surface-container ${
          featured ? "aspect-[4/5]" : compact ? "aspect-[4/5]" : "aspect-[3/4]"
        }`}
      >
        <ProductImage src={activeImage} alt={name} fit={imageFit} />
        <span
          className={`absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${
            isActive
              ? "bg-primary-fixed text-on-primary-container"
              : "bg-error-container text-on-error-container"
          }`}
        >
          {isActive ? "Activo" : "Inactivo"}
        </span>
        {onEdit || onManageVariants ? null : (
          <button
            type="button"
            className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-primary text-on-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            aria-label={`Ver ${name}`}
          >
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              add
            </span>
          </button>
        )}
      </div>

      <div
        className={`${
          featured ? "space-y-5 p-7" : compact ? "space-y-3 p-4" : "space-y-4 p-6"
        }`}
      >
        <div className="space-y-2">
          {brand?.name && (
            <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">
              {brand.name}
            </p>
          )}
          <div className="flex items-start justify-between gap-5">
            <h3
              className={`${
                featured ? "text-headline-md" : compact ? "text-lg" : "text-xl"
              } min-w-0 font-display leading-tight text-on-surface`}
            >
              {name}
            </h3>
            <p className={`${compact ? "text-sm" : "text-body-md"} shrink-0 font-medium text-on-surface`}>
              {formatCurrency(price)}
            </p>
          </div>
          {description && (
            <p className={`${compact ? "line-clamp-1" : "line-clamp-2"} text-sm leading-6 text-on-surface-variant`}>
              {description}
            </p>
          )}
        </div>

        {onEdit || onManageVariants ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <InfoItem icon="category" label="Categoria" value={category?.name} />
            <InfoItem icon="group" label="Genero" value={gender?.name} />
            <InfoItem icon="toggle_on" label="Estado" value={state?.name} />
            <InfoItem icon="texture" label="Material" value={material} />
          </div>
        ) : (
          <div className={`${compact ? "gap-3 py-3" : "gap-4 py-4"} grid grid-cols-2 border-y border-outline-variant/30`}>
            <DetailTag label="Categoria" value={category?.name} />
            <DetailTag label="Material" value={material} />
          </div>
        )}

        <div className={`${compact ? "space-y-2" : "space-y-3"}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
              Colores
            </p>
            {activeColor && (
              <span className="text-label-sm font-semibold uppercase text-on-surface-variant">
                {activeColor.hex}
              </span>
            )}
          </div>
          <ColorSelector
            colors={colorVariants}
            activeIndex={activeColorIndex}
            onSelect={setActiveColorIndex}
          />
          <VariantSummary
            color={activeColor}
            totalVariants={variants.length}
            compact={compact}
          />
        </div>

        {(onEdit || onManageVariants) && (
          <div className="flex flex-wrap gap-2 pt-1">
            <CardAction
              icon="inventory_2"
              label="Variantes"
              onClick={onManageVariants ? () => onManageVariants(product) : null}
            />
            <CardAction
              icon="edit"
              label="Editar"
              variant="secondary"
              onClick={onEdit ? () => onEdit(product) : null}
            />
          </div>
        )}
      </div>
    </article>
  );
}

const entityShape = PropTypes.shape({
  name: PropTypes.string,
});

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    brand: entityShape,
    category: entityShape,
    gender: entityShape,
    state: entityShape,
    description: PropTypes.string,
    material: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        code_hex: PropTypes.string,
        hex: PropTypes.string,
        imagePublicUrl: PropTypes.string,
        size_name: PropTypes.string,
        size: entityShape,
      }),
    ),
  }).isRequired,
  onEdit: PropTypes.func,
  onManageVariants: PropTypes.func,
  featured: PropTypes.bool,
  compact: PropTypes.bool,
  imageFit: PropTypes.oneOf(["cover", "contain"]),
};

ProductCard.defaultProps = {
  onEdit: null,
  onManageVariants: null,
  featured: false,
  compact: false,
  imageFit: "cover",
};

export default ProductCard;
