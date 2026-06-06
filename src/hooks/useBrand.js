import { useState, useEffect } from 'react'
import {
  getBrands,
  addBrand,
  editBrand,
  removeBrand,
} from '../services/brandService'

export const useBrand = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const loadBrands = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBrands()
      setBrands(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    setError(null)
    try {
      const newBrand = await addBrand(payload)
      setBrands((prev) => [newBrand, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const update = async (id, payload) => {
    setError(null)
    try {
      const updated = await editBrand(id, payload)
      setBrands((prev) =>
        prev.map((brand) => (brand.id === id ? updated : brand))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    setError(null)
    try {
      await removeBrand(id)
      setBrands((prev) => prev.filter((brand) => brand.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBrands()
  }, [])

  return { brands, loading, error, create, update, remove, reload: loadBrands }
}
