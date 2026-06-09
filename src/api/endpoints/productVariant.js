import { supabase } from '../client'

const TABLE = 'product_variants'

export const fetchProductVariants = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const fetchProductVariantById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()
  return { data, error }
}

export const createProductVariant = async (payload) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single()
  return { data, error }
}

export const updateProductVariant = async (id, payload) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export const deleteProductVariant = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}
