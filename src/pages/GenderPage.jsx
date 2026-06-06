import { useState } from "react";
import Table from "../components/ui/Table";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import GenderForm from "../components/GenderForm";
import { useGender } from "../hooks/useGender";

function GenderPage() {
  const { genders, loading, error, create, update, remove } = useGender();
  const [editing, setEditing] = useState(null);

  const handleCreate = async (data) => {
    await create(data);
  };

  const handleUpdate = async (data) => {
    await update(editing.id, data);
    setEditing(null);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar "${row.name}"?`)) return;
    await remove(row.id);
  };

  const columns = [
    { label: "Nombre", key: "name" },
    { label: "Acciones", key: "actions" },
  ];

  const rows = genders.map((gender) => ({
    ...gender,
    actions: (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" icon="edit" onClick={() => setEditing(gender)}>
          Editar
        </Button>
        <Button variant="danger" icon="delete" onClick={() => handleDelete(gender)}>
          Eliminar
        </Button>
      </div>
    ),
  }));

  if (loading) return <p className="text-on-surface-variant">Cargando géneros...</p>;
  if (error) return <p className="text-error">Error: {error}</p>;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">
            Catálogo
          </p>
          <h2 className="font-display text-headline-lg text-on-surface">Géneros</h2>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Administra los grupos usados para organizar los productos del portafolio.
          </p>
        </div>
      </section>

      <Card tone="muted">
        <div className="mb-6">
          <h3 className="font-display text-headline-md">
            {editing ? "Editar género" : "Nuevo género"}
          </h3>
          <p className="text-on-surface-variant">
            {editing
              ? "Actualiza el nombre manteniendo la estructura del catálogo."
              : "Crea una marca reutilizable para productos actuales y futuros."}
          </p>
        </div>
        <GenderForm
          key={editing?.id ?? "new"}
          onSubmit={editing ? handleUpdate : handleCreate}
          defaultValues={editing ?? undefined}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </Card>

      <Table columns={columns} data={rows} emptyMessage="Aún no hay géneros registrados." />
    </div>
  );
}

export default GenderPage;
