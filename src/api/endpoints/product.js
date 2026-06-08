import { supabase } from '../client'

const TABLE = 'product'

const RELATIONS = `
  *,
  category:categories(id, name),
  brand:brands(id, name),
  gender:genders(id, name),
  state:states(id, name)
`;

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(RELATIONS)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(RELATIONS)
    .eq('id', id)
    .is('deleted_at', null)
    .single()
  return { data, error }
}

export const createProduct = async (payload) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select(RELATIONS)
    .single()
  return { data, error }
}

export const updateProduct = async (id, payload) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('id', id)
    .select(RELATIONS)
    .single()
  return { data, error }
}

export const deleteProduct = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select(RELATIONS)
    .single()
  return { data, error }
}
