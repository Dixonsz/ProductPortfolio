export const genderAdapter = (raw) => ({
  id: raw.id,
  name: raw.name,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const genderListAdapter = (rawList = []) => rawList.map(genderAdapter);




