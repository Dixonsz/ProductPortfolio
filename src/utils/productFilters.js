export const PRODUCT_FILTER_DEFAULTS = {
  search: "",
  categoryId: "",
  brandId: "",
  genderId: "",
  stateId: "",
  sizeId: "",
  color: "",
  minPrice: "",
  maxPrice: "",
  onlyActive: true,
};

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function idsAreEqual(firstId, secondId) {
  if (!firstId || !secondId) return true;
  return String(firstId) === String(secondId);
}

function productMatchesSearch(product, search) {
  const query = normalizeText(search);
  if (!query) return true;

  const searchableValues = [
    product.name,
    product.description,
    product.material,
    product.brand?.name,
    product.category?.name,
    product.gender?.name,
    product.state?.name,
  ];

  return searchableValues.some((value) => normalizeText(value).includes(query));
}

function productMatchesPrice(product, minPrice, maxPrice) {
  const price = Number(product.price ?? 0);
  const minimum = minPrice === "" ? null : Number(minPrice);
  const maximum = maxPrice === "" ? null : Number(maxPrice);

  if (Number.isNaN(price)) return false;
  if (minimum !== null && price < minimum) return false;
  if (maximum !== null && price > maximum) return false;

  return true;
}

function productMatchesVariant(product, filters) {
  const variants = product.variants ?? [];

  if (!filters.sizeId && !filters.color) return true;

  return variants.some((variant) => {
    const matchesSize = idsAreEqual(variant.size_id, filters.sizeId);
    const variantColor = normalizeText(variant.code_hex || variant.hex);
    const matchesColor = !filters.color || variantColor === normalizeText(filters.color);

    return matchesSize && matchesColor;
  });
}

export function filterProducts(products = [], filters = PRODUCT_FILTER_DEFAULTS) {
  return products.filter((product) => {
    if (filters.onlyActive && product.is_active === false) return false;
    if (!productMatchesSearch(product, filters.search)) return false;
    if (!idsAreEqual(product.category_id, filters.categoryId)) return false;
    if (!idsAreEqual(product.brand_id, filters.brandId)) return false;
    if (!idsAreEqual(product.gender_id, filters.genderId)) return false;
    if (!idsAreEqual(product.state_id, filters.stateId)) return false;
    if (!productMatchesPrice(product, filters.minPrice, filters.maxPrice)) return false;
    if (!productMatchesVariant(product, filters)) return false;

    return true;
  });
}
