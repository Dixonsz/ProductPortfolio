export const stateAdapter = (raw) => ({
  id: raw.id,
  name: raw.name,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const stateListAdapter = (rawList = []) => rawList.map(stateAdapter);



