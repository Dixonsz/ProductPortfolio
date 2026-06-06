import { supabase } from '../client'

const TABLE = 'color'

export const fetchColors = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const fetchColorById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()
  return { data, error }
}

export const createColor = async (payload) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single()
  return { data, error }
}

export const updateColor = async (id, payload) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export const deleteColor = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}
