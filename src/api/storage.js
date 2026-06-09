import {supabase} from './client'

const BUCKET = 'Catalogo'

export function getPublicUrl(path) {
    if (!path) return null
    const {data} = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
}

export async function uploadFile(file) {
    const ext = file.name.split('.').pop()
    const filePath = `Catalogo/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const {error} = await supabase.storage.
    from(BUCKET).
    upload(filePath, file, {upsert: false})

    if (error) throw error

    return filePath
}

export async function deleteFile(path){
    if (!path) return
    const {error} = await supabase.storage.from(BUCKET).remove([path])
    if (error) throw error
}
