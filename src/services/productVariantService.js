import {
    fetchProductVariants,
    fetchProductVariantById,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant
} from '../api/endpoints/productVariant';

import {
    productVariantAdapter,
    productVariantListAdapter
} from '../adapters/productVariantAdapter';

export const getProductVariants = async () => {
    const {data, error} = await fetchProductVariants();
    if (error) throw new Error(error.message);
    return productVariantListAdapter(data);
}

export const getProductVariantById = async (id) => {
    const {data, error} = await fetchProductVariantById(id);
    if (error) throw new Error(error.message);
    return productVariantAdapter(data);
}

export const addProductVariant = async (payload) => {
    const {data, error} = await createProductVariant(payload);
    if (error) throw new Error(error.message);
    return productVariantAdapter(data);
};

export const editProductVariant = async (id, payload) => {
    const {data, error} = await updateProductVariant(id, payload);
    if (error) throw new Error(error.message);
    return productVariantAdapter(data);
}

export const removeProductVariant = async (id) => {
    const {data, error} = await deleteProductVariant(id);
    if (error) throw new Error(error.message);
    return productVariantAdapter(data);
}
