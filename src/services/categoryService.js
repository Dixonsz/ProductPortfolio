import {
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../api/endpoints/category';

import {
    categoryAdapter,
    categoryListAdapter
} from '../adapters/categoryAdapter';

export const getCategories = async () => {
    const {data, error} = await fetchCategories();
    if (error) throw new Error(error.message);
    return categoryListAdapter(data);
}

export const getCategoryById = async (id) => {
    const {data, error} = await fetchCategoryById(id);
    if (error) throw new Error(error.message);
    return categoryAdapter(data);
}

export const addCategory = async (payload) => {
    const {data, error} = await createCategory(payload);
    if (error) throw new Error(error.message);
    return categoryAdapter(data);
};

export const editCategory = async (id, payload) => {
    const {data, error} = await updateCategory(id, payload);
    if (error) throw new Error(error.message);
    return categoryAdapter(data);
}

export const removeCategory = async (id) => {
    const {data, error} = await deleteCategory(id);
    if (error) throw new Error(error.message);
    return categoryAdapter(data);
}
