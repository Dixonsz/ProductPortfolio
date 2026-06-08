import { useState, useEffect } from 'react'
import {
  getProducts,
  addProduct,
  editProduct,
  removeProduct,
} from '../services/productService'

export const useProduct = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    setError(null)
    try {
      const newProduct = await addProduct(payload)
      setProducts((prev) => [newProduct, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const update = async (id, payload) => {
    setError(null)
    try {
      const updated = await editProduct(id, payload)
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updated : product))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    setError(null)
    try {
      await removeProduct(id)
      setProducts((prev) => prev.filter((product) => product.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts()
  }, [])

  return { products, loading, error, create, update, remove, reload: loadProducts }
}
