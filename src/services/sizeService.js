import {
    fetchSizes,
    fetchSizeById,
    createSize,
    updateSize,
    deleteSize
} from '../api/endpoints/size';

import {
    sizeAdapter,
    sizeListAdapter
} from '../adapters/sizeAdapter';

export const getSizes = async () => {
    const {data, error} = await fetchSizes();
    if (error) throw new Error(error.message);
    return sizeListAdapter(data);
}

export const getSizeById = async (id) => {
    const {data, error} = await fetchSizeById(id);
    if (error) throw new Error(error.message);
    return sizeAdapter(data);
}

export const addSize = async (payload) => {
    const {data, error} = await createSize(payload);
    if (error) throw new Error(error.message);
    return sizeAdapter(data);
};

export const editSize = async (id, payload) => {
    const {data, error} = await updateSize(id, payload);
    if (error) throw new Error(error.message);
    return sizeAdapter(data);
}

export const removeSize = async (id) => {
    const {data, error} = await deleteSize(id);
    if (error) throw new Error(error.message);
    return sizeAdapter(data);
}
