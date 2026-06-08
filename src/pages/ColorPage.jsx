import { useState } from "react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import SlidePanel from "../components/ui/SlidePanel";
import ColorForm from "../components/ColorForm";
import { useColor } from "../hooks/useColor";

function ColorPage() {
  const { colors, loading, error, create, update, remove } = useColor();
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

  const openEditPanel = (color) => {
    setEditing(color);
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
    { label: "Código", key: "preview" },
    { label: "Acciones", key: "actions" },
  ];

  const rows = colors.map((color) => ({
    ...color,
    preview: (
      <div className="flex items-center gap-3">
        <span
          className="h-9 w-9 shrink-0 rounded-full border border-outline-variant/60 shadow-sm"
          style={{ backgroundColor: color.hex_code }}
          aria-label={`Color ${color.name}`}
          role="img"
        />
        <span className="text-body-md text-on-surface-variant">{color.hex_code}</span>
      </div>
    ),
    actions: (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" icon="edit" onClick={() => openEditPanel(color)}>
        </Button>
        <Button variant="danger" icon="delete" onClick={() => handleDelete(color)}>
        </Button>
      </div>
    ),
  }));

  if (loading) return <p className="text-on-surface-variant">Cargando colores...</p>;
  if (error) return <p className="text-error">Error: {error}</p>;

  const panelTitle = editing ? "Editar color" : "Nuevo color";
  const panelDescription = editing
    ? "Actualiza el nombre manteniendo la estructura del catálogo."
    : "Crea un color reutilizable para productos actuales y futuros.";

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">Gestión de Colores</h2>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Administra los colores disponibles para personalizar sus productos. 
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
        <ColorForm
          key={editing?.id ?? "new"}
          onSubmit={editing ? handleUpdate : handleCreate}
          defaultValues={editing ?? undefined}
          onCancel={closePanel}
        />
      </SlidePanel>

      <Table columns={columns} data={rows} emptyMessage="Aún no hay colores registrados." />
    </div>
  );
}

export default ColorPage;
