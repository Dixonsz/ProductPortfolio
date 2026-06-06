import { useState } from "react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import SlidePanel from "../components/ui/SlidePanel";
import GenderForm from "../components/GenderForm";
import { useGender } from "../hooks/useGender";

function GenderPage() {
  const { genders, loading, error, create, update, remove } = useGender();
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

  const openEditPanel = (gender) => {
    setEditing(gender);
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

  const rows = genders.map((gender) => ({
    ...gender,
    actions: (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" icon="edit" onClick={() => openEditPanel(gender)}>
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

  const panelTitle = editing ? "Editar género" : "Nuevo género";
  const panelDescription = editing
    ? "Actualiza el nombre manteniendo la estructura del catálogo."
    : "Crea un género reutilizable para productos actuales y futuros.";

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
        <GenderForm
          key={editing?.id ?? "new"}
          onSubmit={editing ? handleUpdate : handleCreate}
          defaultValues={editing ?? undefined}
          onCancel={closePanel}
        />
      </SlidePanel>

      <Table columns={columns} data={rows} emptyMessage="Aún no hay géneros registrados." />
    </div>
  );
}

export default GenderPage;
