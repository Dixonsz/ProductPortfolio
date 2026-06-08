import { useState } from "react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import SlidePanel from "../components/ui/SlidePanel";
import SizeForm from "../components/SizeForm";
import { useSize } from "../hooks/useSize";

function SizePage() {
  const { sizes, loading, error, create, update, remove } = useSize();
  const [editing, setEditing] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditing(null);
  };

  const openCreatePanel = () => {
    setEditing(null);
    setIsPanelOpen(true);
  };

  const openEditPanel = (size) => {
    setEditing(size);
    setIsPanelOpen(true);
  };

  const handleCreate = async (data) => {
    await create(data);
    closePanel();
  };

  const handleUpdate = async (data) => {
    await update(editing.id, data);
    closePanel();
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar "${row.name}"?`)) return;
    await remove(row.id);
  };

  const columns = [
    { label: "Nombre", key: "name" },
    { label: "Acciones", key: "actions" },
  ];

  const rows = sizes.map((size) => ({
    ...size,
    actions: (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" icon="edit" onClick={() => openEditPanel(size)}>
        </Button>
        <Button variant="danger" icon="delete" onClick={() => handleDelete(size)}>
        </Button>
      </div>
    ),
  }));

  if (loading) return <p className="text-on-surface-variant">Cargando tamaños...</p>;
  if (error) return <p className="text-error">Error: {error}</p>;

  const panelTitle = editing ? "Editar tamaño" : "Nuevo tamaño";
  const panelDescription = editing
    ? "Actualiza el nombre manteniendo la estructura del catálogo."
    : "Crea un tamaño reutilizable para productos actuales y futuros.";

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">Gestión de Tamaños</h2>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Administra los tamaños disponibles para clasificar sus productos.
          </p>
        </div>
        <Button icon="add" onClick={openCreatePanel}>
          Agregar
        </Button>
      </section>

      <SlidePanel
        isOpen={isPanelOpen}
        title={panelTitle}
        description={panelDescription}
        onClose={closePanel}
      >
        <SizeForm
          key={editing?.id ?? "new"}
          onSubmit={editing ? handleUpdate : handleCreate}
          defaultValues={editing ?? undefined}
          onCancel={closePanel}
        />
      </SlidePanel>

      <Table columns={columns} data={rows} emptyMessage="Aún no hay tamaños registrados." />
    </div>
  );
}

export default SizePage;
