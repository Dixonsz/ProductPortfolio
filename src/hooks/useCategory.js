import { useState, useEffect } from 'react'
import {
  getCategories,
  addCategory,
  editCategory,
  removeCategory,
} from '../services/categoryService'

export const useCategory = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    setError(null)
    try {
      const newCategory = await addCategory(payload)
      setCategories((prev) => [newCategory, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const update = async (id, payload) => {
    setError(null)
    try {
      const updated = await editCategory(id, payload)
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updated : cat))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    setError(null)
    try {
      await removeCategory(id)
      setCategories((prev) => prev.filter((cat) => cat.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories()
  }, [])

  return { categories, loading, error, create, update, remove, reload: loadCategories }
}
