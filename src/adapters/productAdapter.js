export const productAdapter = (raw) => ({
  id: raw.id,
  category_id: raw.category_id,
  brand_id: raw.brand_id,
  gender_id: raw.gender_id,
  state_id: raw.state_id,
  image_url: raw.image_url,
  description: raw.description,
  price: raw.price,
  is_active: raw.is_active,
  material: raw.material,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,

  category: raw.category ?? null,
  brand: raw.brand ?? null,
  gender: raw.gender ?? null,
  state: raw.state ?? null,
});

export const productListAdapter = (rawList = []) => rawList.map(productAdapter);




