import { useState, useEffect } from 'react'
import {
  getProductVariants,
  addProductVariant,
  editProductVariant,
  removeProductVariant,
} from '../services/productVariantService'

export const useProductVariant = () => {
  const [productVariants, setProductVariants] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const loadProductVariants = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProductVariants()
      setProductVariants(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    setError(null)
    try {
      const newProductVariant = await addProductVariant(payload)
      setProductVariants((prev) => [newProductVariant, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const update = async (id, payload) => {
    setError(null)
    try {
      const updated = await editProductVariant(id, payload)
      setProductVariants((prev) =>
        prev.map((productVariant) => (productVariant.id === id ? updated : productVariant))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    setError(null)
    try {
      await removeProductVariant    (id)
      setProductVariants((prev) => prev.filter((productVariant) => productVariant.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProductVariants()
  }, [])

  return { productVariants, loading, error, create, update, remove, reload: loadProductVariants }
}
