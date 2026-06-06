import { useState, useEffect } from 'react'
import {
  getGenders,
  addGender,
  editGender,
  removeGender,
} from '../services/genderService'

export const useGender = () => {
  const [genders, setGenders] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const loadGenders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getGenders()
      setGenders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    setError(null)
    try {
      const newGender = await addGender(payload)
      setGenders((prev) => [newGender, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const update = async (id, payload) => {
    setError(null)
    try {
      const updated = await editGender(id, payload)
      setGenders((prev) =>
        prev.map((gender) => (gender.id === id ? updated : gender))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    setError(null)
    try {
      await removeGender(id)
      setGenders((prev) => prev.filter((gender) => gender.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGenders()
  }, [])

  return { genders, loading, error, create, update, remove, reload: loadGenders }
}
