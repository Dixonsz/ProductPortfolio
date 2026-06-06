import { useState, useEffect } from 'react'
import {
  getColors,
  addColor,
  editColor,
  removeColor,
} from '../services/colorService'

export const useColor = () => {
  const [colors, setColors] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const loadColors = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getColors()
      setColors(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    setError(null)
    try {
      const newColor = await addColor(payload)
      setColors((prev) => [newColor, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const update = async (id, payload) => {
    setError(null)
    try {
      const updated = await editColor(id, payload)
      setColors((prev) =>
        prev.map((color) => (color.id === id ? updated : color))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    setError(null)
    try {
      await removeColor(id)
      setColors((prev) => prev.filter((color) => color.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadColors()
  }, [])

  return { colors, loading, error, create, update, remove, reload: loadColors }
}
