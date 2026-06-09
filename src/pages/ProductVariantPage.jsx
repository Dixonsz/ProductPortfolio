import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import SlidePanel from "../components/ui/SlidePanel";
import ProductVariantForm from "../components/ProductVariantForm";
import { useProduct } from "../hooks/useProduct";
import { useProductVariant } from "../hooks/useProductVariant";
import { useSize } from "../hooks/useSize";

function idsAreEqual(firstId, secondId) {
  return String(firstId) === String(secondId);
}

function ProductVariantPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, loading: loadingProducts, error: productError } = useProduct();
  const { sizes, loading: loadingSizes, error: sizeError } = useSize();
  const {
    productVariants,
    loading: loadingVariants,
    error: variantError,
    create,
    update,
    remove,
  } = useProductVariant();
  const [editing, setEditing] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const product = products.find((item) => idsAreEqual(item.id, productId));

  const variantsByProduct = useMemo(
    () =>
      productVariants.filter((variant) =>
        idsAreEqual(variant.product_id, productId),
      ),
    [productVariants, productId],
  );

  const sizesById = useMemo(
    () =>
      sizes.reduce((indexedSizes, size) => {
        indexedSizes[String(size.id)] = size;
        return indexedSizes;
      }, {}),
    [sizes],
  );

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditing(null);
  };

  const openCreatePanel = () => {
    setEditing(null);
    setIsPanelOpen(true);
  };

  const openEditPanel = (variant) => {
    setEditing(variant);
    setIsPanelOpen(true);
  };

  const handleCreate = async (data) => {
    await create({
      ...data,
      product_id: productId,
    });
    closePanel();
  };

  const handleUpdate = async (data) => {
    await update(editing.id, {
      ...data,
      product_id: productId,
    });
    closePanel();
  };

  const handleDelete = async (variant) => {
    const sizeName = sizesById[String(variant.size_id)]?.name ?? "esta variante";
    if (!window.confirm(`Eliminar "${sizeName}"?`)) return;
    await remove(variant.id);
  };

  const columns = [
    { label: "Talla", key: "size_name" },
    { label: "Color", key: "color" },
    { label: "Imagen", key: "image_url" },
    { label: "Acciones", key: "actions" },
  ];

  const rows = variantsByProduct.map((variant) => ({
    ...variant,
    size_name: sizesById[String(variant.size_id)]?.name ?? "-",
    color: (
      <div className="flex items-center gap-3">
        <span
          className="h-8 w-8 rounded-full border border-outline-variant/60 shadow-inner"
          style={{ backgroundColor: variant.code_hex }}
        />
        <span className="font-medium uppercase">{variant.code_hex}</span>
      </div>
    ),
    image_url: variant.image_url ? (
      <a
        href={variant.image_url}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline-offset-4 hover:underline"
      >
        Ver imagen
      </a>
    ) : (
      "-"
    ),
    actions: (
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          icon="edit"
          onClick={() => openEditPanel(variant)}
        ></Button>
        <Button
          variant="danger"
          icon="delete"
          onClick={() => handleDelete(variant)}
        ></Button>
      </div>
    ),
  }));

  const isLoading = loadingProducts || loadingSizes || loadingVariants;
  const pageError = productError || sizeError || variantError;

  if (isLoading)
    return <p className="text-on-surface-variant">Cargando variantes...</p>;
  if (pageError) return <p className="text-error">Error: {pageError}</p>;

  const panelTitle = editing ? "Editar variante" : "Nueva variante";
  const panelDescription = editing
    ? "Actualiza la talla, el color o la imagen de la variante."
    : `Crea una variante para ${product?.name ?? "este producto"}.`;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Button
            variant="ghost"
            icon="arrow_back"
            className="mb-4"
            onClick={() => navigate("/products")}
          >
            Volver
          </Button>
          <h2 className="font-display text-headline-lg text-on-surface">
            Variantes de {product?.name ?? "producto"}
          </h2>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Administra las tallas, colores e imagenes disponibles para este producto.
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
        <ProductVariantForm
          key={editing?.id ?? `new-${productId}`}
          onSubmit={editing ? handleUpdate : handleCreate}
          defaultValues={editing ?? { product_id: productId }}
          onCancel={closePanel}
          products={products}
          sizes={sizes}
          isProductDisabled
        />
      </SlidePanel>

      <Table
        columns={columns}
        data={rows}
        emptyMessage="Aun no hay variantes registradas para este producto."
      />
    </div>
  );
}

export default ProductVariantPage;
