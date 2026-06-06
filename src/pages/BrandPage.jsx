import { useState } from "react";
import Table from "../components/ui/Table";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import BrandForm from "../components/BrandForm";
import { useBrand } from "../hooks/useBrand";

function BrandPage() {
  const { brands, loading, error, create, update, remove } = useBrand();
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

  const rows = brands.map((brand) => ({
    ...brand,
    actions: (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" icon="edit" onClick={() => setEditing(brand)}>
          Editar
        </Button>
        <Button variant="danger" icon="delete" onClick={() => handleDelete(brand)}>
          Eliminar
        </Button>
      </div>
    ),
  }));

  if (loading) return <p className="text-on-surface-variant">Cargando marcas...</p>;
  if (error) return <p className="text-error">Error: {error}</p>;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">
            Catálogo
          </p>
          <h2 className="font-display text-headline-lg text-on-surface">Marcas</h2>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Administra los grupos usados para organizar los productos del portafolio.
          </p>
        </div>
      </section>

      <Card tone="muted">
        <div className="mb-6">
          <h3 className="font-display text-headline-md">
            {editing ? "Editar marca" : "Nueva marca"}
          </h3>
          <p className="text-on-surface-variant">
            {editing
              ? "Actualiza el nombre manteniendo la estructura del catálogo."
              : "Crea una marca reutilizable para productos actuales y futuros."}
          </p>
        </div>
        <BrandForm
          key={editing?.id ?? "new"}
          onSubmit={editing ? handleUpdate : handleCreate}
          defaultValues={editing ?? undefined}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </Card>

      <Table columns={columns} data={rows} emptyMessage="Aún no hay marcas registradas." />
    </div>
  );
}

export default BrandPage;
