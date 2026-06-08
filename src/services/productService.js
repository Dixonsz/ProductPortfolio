import {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../api/endpoints/product';

import {
    productAdapter,
    productListAdapter
} from '../adapters/productAdapter';

export const getProducts = async () => {
    const {data, error} = await fetchProducts();
    if (error) throw new Error(error.message);
    return productListAdapter(data);
}

export const getProductById = async (id) => {
    const {data, error} = await fetchProductById(id);
    if (error) throw new Error(error.message);
    return productAdapter(data);
}

export const addProduct = async (payload) => {
    const {data, error} = await createProduct(payload);
    if (error) throw new Error(error.message);
    return productAdapter(data);
};

export const editProduct = async (id, payload) => {
    const {data, error} = await updateProduct(id, payload);
    if (error) throw new Error(error.message);
    return productAdapter(data);
}

export const removeProduct = async (id) => {
    const {data, error} = await deleteProduct(id);
    if (error) throw new Error(error.message);
    return productAdapter(data);
}
