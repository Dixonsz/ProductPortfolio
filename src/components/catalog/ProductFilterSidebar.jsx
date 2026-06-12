import PropTypes from "prop-types";
import { PRODUCT_FILTER_DEFAULTS } from "../../utils/productFilters";

function getOptionLabel(option) {
  return option.name ?? option.label ?? "";
}

function getOptionValue(option) {
  return String(option.id ?? option.value ?? "");
}

function FilterSelect({ id, label, value, options, placeholder, onChange }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-full border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

function PriceInput({ id, label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        min="0"
        step="0.01"
        value={value}
        placeholder="0.00"
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-full border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

function ColorFilter({ colors, selectedColor, onChange }) {
  if (colors.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
        Color
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const colorValue = color.hex ?? color.value ?? color;
          const isSelected = selectedColor === colorValue;

          return (
            <button
              key={colorValue}
              type="button"
              onClick={() => onChange(isSelected ? "" : colorValue)}
              className={`h-9 w-9 rounded-full border transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-surface-container-lowest"
                  : "border-outline-variant/70"
              }`}
              style={{ backgroundColor: colorValue }}
              title={`Color ${colorValue}`}
              aria-label={`Filtrar por color ${colorValue}`}
              aria-pressed={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProductFilterSidebar({
  filters,
  categories,
  brands,
  genders,
  states,
  sizes,
  colors,
  resultCount,
  onChange,
  onClear,
  onHide,
  idPrefix = "product-filter",
  className = "",
}) {
  const currentFilters = {
    ...PRODUCT_FILTER_DEFAULTS,
    ...filters,
  };

  const updateFilter = (key, value) => {
    onChange({
      ...currentFilters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    if (onClear) {
      onClear();
      return;
    }

    onChange(PRODUCT_FILTER_DEFAULTS);
  };

  return (
    <aside
      className={`space-y-7 border-outline-variant/20 bg-surface-container-low p-6 ${className}`}
      aria-label="Filtros de productos"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-headline-md text-primary">Filtros</h2>
          {typeof resultCount === "number" && (
            <p className="mt-1 text-label-sm text-on-surface-variant/70">
              {resultCount} productos encontrados
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary"
            aria-label="Limpiar filtros"
            title="Limpiar filtros"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              restart_alt
            </span>
          </button>
          {onHide && (
            <button
              type="button"
              onClick={onHide}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary"
              aria-label="Ocultar filtros"
              title="Ocultar filtros"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                left_panel_close
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor={`${idPrefix}-search`}
          className="block text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant"
        >
          Buscar
        </label>
        <div className="flex items-center gap-3 rounded-full border border-outline-variant/40 bg-surface-container px-4 py-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant" aria-hidden="true">
            search
          </span>
          <input
            id={`${idPrefix}-search`}
            type="search"
            value={currentFilters.search}
            placeholder="Nombre, marca o material"
            onChange={(event) => updateFilter("search", event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/70"
          />
        </div>
      </div>

      <div className="grid gap-4 border-y border-outline-variant/30 py-6">
        <FilterSelect
          id={`${idPrefix}-category`}
          label="Categoria"
          value={currentFilters.categoryId}
          options={categories}
          placeholder="Todas"
          onChange={(value) => updateFilter("categoryId", value)}
        />
        <FilterSelect
          id={`${idPrefix}-brand`}
          label="Marca"
          value={currentFilters.brandId}
          options={brands}
          placeholder="Todas"
          onChange={(value) => updateFilter("brandId", value)}
        />
        <FilterSelect
          id={`${idPrefix}-gender`}
          label="Genero"
          value={currentFilters.genderId}
          options={genders}
          placeholder="Todos"
          onChange={(value) => updateFilter("genderId", value)}
        />
        <FilterSelect
          id={`${idPrefix}-state`}
          label="Estado"
          value={currentFilters.stateId}
          options={states}
          placeholder="Todos"
          onChange={(value) => updateFilter("stateId", value)}
        />
        <FilterSelect
          id={`${idPrefix}-size`}
          label="Talla"
          value={currentFilters.sizeId}
          options={sizes}
          placeholder="Todas"
          onChange={(value) => updateFilter("sizeId", value)}
        />
      </div>

      <ColorFilter
        colors={colors}
        selectedColor={currentFilters.color}
        onChange={(value) => updateFilter("color", value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <PriceInput
          id={`${idPrefix}-min-price`}
          label="Min"
          value={currentFilters.minPrice}
          onChange={(value) => updateFilter("minPrice", value)}
        />
        <PriceInput
          id={`${idPrefix}-max-price`}
          label="Max"
          value={currentFilters.maxPrice}
          onChange={(value) => updateFilter("maxPrice", value)}
        />
      </div>
    </aside>
  );
}

const optionShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  label: PropTypes.string,
});

FilterSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(optionShape),
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

FilterSelect.defaultProps = {
  value: "",
  options: [],
};

PriceInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

PriceInput.defaultProps = {
  value: "",
};

ColorFilter.propTypes = {
  colors: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        hex: PropTypes.string,
        value: PropTypes.string,
      }),
    ]),
  ),
  selectedColor: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ColorFilter.defaultProps = {
  colors: [],
  selectedColor: "",
};

ProductFilterSidebar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    brandId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    genderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stateId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sizeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string,
    minPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onlyActive: PropTypes.bool,
  }),
  categories: PropTypes.arrayOf(optionShape),
  brands: PropTypes.arrayOf(optionShape),
  genders: PropTypes.arrayOf(optionShape),
  states: PropTypes.arrayOf(optionShape),
  sizes: PropTypes.arrayOf(optionShape),
  colors: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        hex: PropTypes.string,
        value: PropTypes.string,
      }),
    ]),
  ),
  resultCount: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  onHide: PropTypes.func,
  idPrefix: PropTypes.string,
  className: PropTypes.string,
};

ProductFilterSidebar.defaultProps = {
  filters: PRODUCT_FILTER_DEFAULTS,
  categories: [],
  brands: [],
  genders: [],
  states: [],
  sizes: [],
  colors: [],
  resultCount: null,
  onClear: null,
  onHide: null,
  idPrefix: "product-filter",
  className: "",
};

export default ProductFilterSidebar;
