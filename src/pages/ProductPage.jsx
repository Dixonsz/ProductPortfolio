import { useState } from "react";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import SlidePanel from "../components/ui/SlidePanel";
import ProductForm from "../components/ProductForm";
import { useProduct } from "../hooks/useProduct";
import { useCategory } from "../hooks/useCategory";
import { useBrand } from "../hooks/useBrand";
import { useGender } from "../hooks/useGender";
import { useStates } from "../hooks/useStates";

function ProductPage() {
  const { products, loading, error, create, update, remove } = useProduct();
  const {
    categories,
    loading: loadingCategories,
    error: categoryError,
  } = useCategory();
  const { brands, loading: loadingBrands, error: brandError } = useBrand();
  const { genders, loading: loadingGenders, error: genderError } = useGender();
  const { states, loading: loadingStates, error: stateError } = useStates();
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

  const openEditPanel = (product) => {
    setEditing(product);
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
    if (!window.confirm(`Eliminar "${row.name || row.description}"?`)) return;
    await remove(row.id);
  };

  const columns = [
    { label: "Nombre", key: "name" },
    { label: "Categoria", key: "category_name" },
    { label: "Estado", key: "state_name" },
    { label: "Precio", key: "price" },
    { label: "Acciones", key: "actions" },
  ];

  const rows = products.map((product) => ({
    ...product,
    category_name: product.category?.name ?? "-",
    state_name: product.state?.name ?? "-",
    price: `$${Number(product.price ?? 0).toFixed(2)}`,
    actions: (
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          icon="edit"
          onClick={() => openEditPanel(product)}
        ></Button>
        <Button
          variant="danger"
          icon="delete"
          onClick={() => handleDelete(product)}
        ></Button>
      </div>
    ),
  }));

  const isLoading =
    loading ||
    loadingCategories ||
    loadingBrands ||
    loadingGenders ||
    loadingStates;
  const pageError =
    error || categoryError || brandError || genderError || stateError;

  if (isLoading)
    return <p className="text-on-surface-variant">Cargando productos...</p>;
  if (pageError) return <p className="text-error">Error: {pageError}</p>;

  const panelTitle = editing ? "Editar producto" : "Nuevo producto";
  const panelDescription = editing
    ? "Actualiza el producto."
    : "Crea un nuevo producto.";

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">
            Gestión de Productos
          </h2>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Administra los productos disponibles en tu tienda.
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
        <ProductForm
          key={editing?.id ?? "new"}
          onSubmit={editing ? handleUpdate : handleCreate}
          defaultValues={editing ?? undefined}
          onCancel={closePanel}
          categories={categories}
          brands={brands}
          genders={genders}
          states={states}
        />
      </SlidePanel>

      <Table
        columns={columns}
        data={rows}
        emptyMessage="Aun no hay productos registrados."
      />
    </div>
  );
}

export default ProductPage;
