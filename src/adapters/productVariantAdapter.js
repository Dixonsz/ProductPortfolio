import { getPublicUrl } from '../api/storage';

export const productVariantAdapter = (raw) => ({
  id: raw.id,
  product_id: raw.product_id,
  size_id: raw.size_id,
  code_hex: raw.code_hex,
  image_url: raw.image_url,
  imagePublicUrl: getPublicUrl(raw.image_url),
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,

  product: raw.product ?? null,
  size: raw.size ?? null,
});


export const productVariantListAdapter = (rawList = []) => rawList.map(productVariantAdapter);

export const productVariantToRow = (model) => ({
  product_id: model.product_id,
  size_id: model.size_id,
  code_hex: model.code_hex,
  image_url: model.image_url,
});




