import { useState, useEffect } from 'react'
import {
  getStates,
  addState,
  editState,
  removeState,
} from '../services/stateService'

export const useStates = () => {
  const [states, setStates] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const loadStates = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getStates()
      setStates(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const create = async (payload) => {
    setError(null)
    try {
      const newState = await addState(payload)
      setStates((prev) => [newState, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  const update = async (id, payload) => {
    setError(null)
    try {
      const updated = await editState(id, payload)
      setStates((prev) =>
        prev.map((state) => (state.id === id ? updated : state))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    setError(null)
    try {
      await removeState(id)
      setStates((prev) => prev.filter((state) => state.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStates()
  }, [])

  return { states, loading, error, create, update, remove, reload: loadStates }
}
