export const brandAdapter = (raw) => ({
  id: raw.id,
  name: raw.name,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const brandListAdapter = (rawList = []) => rawList.map(brandAdapter);


