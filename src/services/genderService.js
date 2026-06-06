import {
    fetchGenders,
    fetchGenderById,
    createGender,
    updateGender,
    deleteGender
} from '../api/endpoints/gender';

import {
    genderAdapter,
    genderListAdapter
} from '../adapters/genderAdapter';

export const getGenders = async () => {
    const {data, error} = await fetchGenders();
    if (error) throw new Error(error.message);
    return genderListAdapter(data);
}

export const getGenderById = async (id) => {
    const {data, error} = await fetchGenderById(id);
    if (error) throw new Error(error.message);
    return genderAdapter(data);
}

export const addGender = async (payload) => {
    const {data, error} = await createGender(payload);
    if (error) throw new Error(error.message);
    return genderAdapter(data);
};

export const editGender = async (id, payload) => {
    const {data, error} = await updateGender(id, payload);
    if (error) throw new Error(error.message);
    return genderAdapter(data);
}

export const removeGender = async (id) => {
    const {data, error} = await deleteGender(id);
    if (error) throw new Error(error.message);
    return genderAdapter(data);
}
