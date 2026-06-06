import { useState, useEffect } from 'react'
import {
  getSizes,
  addSize,
  editSize,
  removeSize,
} from '../services/sizeService'

export const useSize = () => {
  const [sizes, setSizes] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const loadSizes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSizes()
      setSizes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    setError(null)
    try {
      const newSize = await addSize(payload)
      setSizes((prev) => [newSize, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const update = async (id, payload) => {
    setError(null)
    try {
      const updated = await editSize(id, payload)
      setSizes((prev) =>
        prev.map((size) => (size.id === id ? updated : size))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    setError(null)
    try {
      await removeSize(id)
      setSizes((prev) => prev.filter((size) => size.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSizes()
  }, [])

  return { sizes, loading, error, create, update, remove, reload: loadSizes }
}
