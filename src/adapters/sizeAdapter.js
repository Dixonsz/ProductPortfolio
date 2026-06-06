export const sizeAdapter = (raw) => ({
  id: raw.id,
  name: raw.name,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const sizeListAdapter = (rawList = []) => rawList.map(sizeAdapter);






