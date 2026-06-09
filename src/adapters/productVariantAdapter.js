export const productVariantAdapter = (raw) => ({
  id: raw.id,
  product_id: raw.product_id,
  size_id: raw.size_id,
  code_hex: raw.code_hex,
  image_url: raw.image_url,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,

  product: raw.product ?? null,
  size: raw.size ?? null,
});

export const productVariantListAdapter = (rawList = []) => rawList.map(productVariantAdapter);




