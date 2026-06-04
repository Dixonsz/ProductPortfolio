import { useState } from 'react'
import Table from '../components/ui/Table'
import CategoryForm from '../components/CategoryForm'
import { useCategory } from '../hooks/useCategory'

function CategoryPage() {
  const { categories, loading, error, create, update, remove } = useCategory()
  const [editing, setEditing] = useState(null)

  const handleCreate = async (data) => {
    await create(data)
  }

  const handleUpdate = async (data) => {
    await update(editing.id, data)
    setEditing(null)
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar "${row.name}"?`)) return
    await remove(row.id)
  }

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Creado', key: 'createdAt' },
    { label: 'Acciones', key: 'actions' },
  ]

  const rows = categories.map((cat) => ({
    ...cat,
    actions: (
      <div>
        <button type="button" onClick={() => setEditing(cat)}>Editar</button>
        <button type="button" onClick={() => handleDelete(cat)}>Eliminar</button>
      </div>
    ),
  }))

  if (loading) return <p>Cargando categorías...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h2>Categorías</h2>

      <CategoryForm
        key={editing?.id ?? 'new'}
        onSubmit={editing ? handleUpdate : handleCreate}
        defaultValues={editing ?? undefined}
        onCancel={editing ? () => setEditing(null) : undefined}
      />

      <Table columns={columns} data={rows} />
    </div>
  )
}

export default CategoryPage
