export const colorAdapter = (raw) => ({
  id: raw.id,
  name: raw.name,
  hex_code: raw.hex_code,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const colorListAdapter = (rawList = []) => rawList.map(colorAdapter);
