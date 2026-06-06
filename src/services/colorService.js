import {
    fetchColors,
    fetchColorById,
    createColor,
    updateColor,
    deleteColor
} from '../api/endpoints/color';

import {
    colorAdapter,
    colorListAdapter
} from '../adapters/colorAdapter';

export const getColors = async () => {
    const {data, error} = await fetchColors();
    if (error) throw new Error(error.message);
    return colorListAdapter(data);
}

export const getColorById = async (id) => {
    const {data, error} = await fetchColorById(id);
    if (error) throw new Error(error.message);
    return colorAdapter(data);
}

export const addColor = async (payload) => {
    const {data, error} = await createColor(payload);
    if (error) throw new Error(error.message);
    return colorAdapter(data);
};

export const editColor = async (id, payload) => {
    const {data, error} = await updateColor(id, payload);
    if (error) throw new Error(error.message);
    return colorAdapter(data);
}

export const removeColor = async (id) => {
    const {data, error} = await deleteColor(id);
    if (error) throw new Error(error.message);
    return colorAdapter(data);
}
