export const categoryAdapter = (raw) => ({
  id: raw.id,
  name: raw.name,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const categoryListAdapter = (rawList = []) => rawList.map(categoryAdapter);
