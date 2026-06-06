import {
    fetchBrands,
    fetchBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} from '../api/endpoints/brand';

import {
    brandAdapter,
    brandListAdapter
} from '../adapters/brandAdapter';

export const getBrands = async () => {
    const {data, error} = await fetchBrands();
    if (error) throw new Error(error.message);
    return brandListAdapter(data);
}

export const getBrandById = async (id) => {
    const {data, error} = await fetchBrandById(id);
    if (error) throw new Error(error.message);
    return brandAdapter(data);
}

export const addBrand = async (payload) => {
    const {data, error} = await createBrand(payload);
    if (error) throw new Error(error.message);
    return brandAdapter(data);
};

export const editBrand = async (id, payload) => {
    const {data, error} = await updateBrand(id, payload);
    if (error) throw new Error(error.message);
    return brandAdapter(data);
}

export const removeBrand = async (id) => {
    const {data, error} = await deleteBrand(id);
    if (error) throw new Error(error.message);
    return brandAdapter(data);
}
