import { useMemo, useState } from "react";
import ProductCard from "../components/catalog/ProductCard";
import ProductFilterSidebar from "../components/catalog/ProductFilterSidebar";
import { useBrand } from "../hooks/useBrand";
import { useCategory } from "../hooks/useCategory";
import { useGender } from "../hooks/useGender";
import { useProduct } from "../hooks/useProduct";
import { useProductVariant } from "../hooks/useProductVariant";
import { useSize } from "../hooks/useSize";
import { useStates } from "../hooks/useStates";
import {
  filterProducts,
  PRODUCT_FILTER_DEFAULTS,
} from "../utils/productFilters";

function idsAreEqual(firstId, secondId) {
  return String(firstId) === String(secondId);
}

function getProductImage(product) {
  return (
    product?.variants?.find((variant) => variant.imagePublicUrl)
      ?.imagePublicUrl ?? null
  );
}

function getUniqueColors(variants) {
  const colors = variants
    .map((variant) => variant.code_hex || variant.hex)
    .filter(Boolean);

  return Array.from(new Set(colors));
}

function getOptionsFromProducts(products, relationKey, idKey) {
  const optionsById = new Map();

  products.forEach((product) => {
    const id = product[idKey];
    const name = product[relationKey]?.name;

    if (id && name && !optionsById.has(String(id))) {
      optionsById.set(String(id), { id, name });
    }
  });

  return Array.from(optionsById.values());
}

function mergeOptions(primaryOptions, fallbackOptions) {
  const optionsById = new Map();

  [...primaryOptions, ...fallbackOptions].forEach((option) => {
    const id = option.id ?? option.value;

    if (id && !optionsById.has(String(id))) {
      optionsById.set(String(id), option);
    }
  });

  return Array.from(optionsById.values());
}

function LandingNav() {
  return (
    <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant/30 bg-surface/85 px-5 py-4 backdrop-blur-xl lg:px-16">
      <div className="flex items-center gap-10">
        <a
          href="/landing"
          className="font-display text-headline-md font-medium text-on-surface"
        >
          Amar y Ya
        </a>
      </div>
    </nav>
  );
}

function PageMessage({ tone = "default", children }) {
  const toneClass =
    tone === "error"
      ? "border-error/30 bg-error-container text-on-error-container"
      : "border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant";

  return (
    <main className="min-h-screen bg-background px-6 py-24 text-on-surface">
      <div className={`mx-auto max-w-7xl border px-6 py-8 ${toneClass}`}>
        {children}
      </div>
    </main>
  );
}

function LandingPage() {
  const {
    products,
    loading: loadingProducts,
    error: productError,
  } = useProduct();
  const {
    productVariants,
    loading: loadingVariants,
    error: variantError,
  } = useProductVariant();
  const { categories, error: categoryError } = useCategory();
  const { brands, error: brandError } = useBrand();
  const { genders, error: genderError } = useGender();
  const { states, error: stateError } = useStates();
  const { sizes, error: sizeError } = useSize();
  const [filters, setFilters] = useState(PRODUCT_FILTER_DEFAULTS);

  const sizesById = useMemo(
    () =>
      sizes.reduce((indexedSizes, size) => {
        indexedSizes[String(size.id)] = size;
        return indexedSizes;
      }, {}),
    [sizes],
  );

  const variantsWithSize = useMemo(
    () =>
      productVariants.map((variant) => ({
        ...variant,
        size: variant.size ?? sizesById[String(variant.size_id)] ?? null,
      })),
    [productVariants, sizesById],
  );

  const productsWithVariants = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        variants: variantsWithSize.filter((variant) =>
          idsAreEqual(variant.product_id, product.id),
        ),
      })),
    [products, variantsWithSize],
  );

  const filteredProducts = useMemo(
    () => filterProducts(productsWithVariants, filters),
    [productsWithVariants, filters],
  );

  const colors = useMemo(
    () => getUniqueColors(variantsWithSize),
    [variantsWithSize],
  );
  const categoryOptions = useMemo(
    () =>
      mergeOptions(
        categories,
        getOptionsFromProducts(productsWithVariants, "category", "category_id"),
      ),
    [categories, productsWithVariants],
  );
  const brandOptions = useMemo(
    () =>
      mergeOptions(
        brands,
        getOptionsFromProducts(productsWithVariants, "brand", "brand_id"),
      ),
    [brands, productsWithVariants],
  );
  const genderOptions = useMemo(
    () =>
      mergeOptions(
        genders,
        getOptionsFromProducts(productsWithVariants, "gender", "gender_id"),
      ),
    [genders, productsWithVariants],
  );
  const stateOptions = useMemo(
    () =>
      mergeOptions(
        states,
        getOptionsFromProducts(productsWithVariants, "state", "state_id"),
      ),
    [states, productsWithVariants],
  );
  const heroProduct = filteredProducts[0] ?? productsWithVariants[0];
  const heroImage = getProductImage(heroProduct);
  const highlightedProducts = filteredProducts.slice(0, 4);
  const remainingProducts = filteredProducts.slice(4);
  const isLoading = loadingProducts;
  const pageError = productError;
  const supportingError =
    variantError ||
    categoryError ||
    brandError ||
    genderError ||
    stateError ||
    sizeError;

  const sidebarProps = {
    filters,
    categories: categoryOptions,
    brands: brandOptions,
    genders: genderOptions,
    states: stateOptions,
    sizes,
    colors,
    resultCount: loadingVariants ? productsWithVariants.length : filteredProducts.length,
    onChange: setFilters,
    onClear: () => setFilters(PRODUCT_FILTER_DEFAULTS),
  };

  if (isLoading) {
    return <PageMessage>Cargando catalogo...</PageMessage>;
  }

  if (pageError) {
    return (
      <PageMessage tone="error">
        Error al cargar el catalogo: {pageError}
      </PageMessage>
    );
  }

  return (
    <main className="min-h-screen bg-background text-on-surface">
      <LandingNav />

      <ProductFilterSidebar
        {...sidebarProps}
        idPrefix="desktop-product-filter"
        className="fixed left-0 top-0 z-40 hidden h-full w-72 overflow-y-auto border-r pt-28 lg:block"
      />

      <header className="relative min-h-[760px] overflow-hidden pt-20 lg:ml-72">
        <div className="absolute inset-0 bg-surface-container">
          {heroImage ? (
            <img
              src={heroImage}
              alt={heroProduct?.name ?? "Producto destacado"}
              className="h-full w-full object-cover opacity-90"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="material-symbols-outlined text-7xl text-on-surface-variant/30"
                aria-hidden="true"
              >
                checkroom
              </span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="relative flex min-h-[760px] items-center px-6 py-20 md:px-16">
          <div className="max-w-2xl space-y-6">
            <span className="text-label-sm font-semibold uppercase tracking-[0.3em] text-primary">
         Bienvenido a
            </span>
            <h1 className="font-display text-[52px] leading-none text-on-surface md:text-display-lg">
              Amar y YA
            </h1>
            <p className="max-w-xl text-body-lg text-on-surface-variant">
            "Explora nuestra colección y descubre diseños únicos que combinan elegancia, comodidad y personalidad."
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#catalog"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-9 text-label-sm font-semibold uppercase tracking-widest text-on-primary transition hover:bg-primary/90"
              >
                Explorar ahora
              </a>
              <a
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary px-9 text-label-sm font-semibold uppercase tracking-widest text-primary transition hover:bg-primary/5"
              >
                Administrar
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-surface-container-low px-6 py-8 lg:hidden">
        <ProductFilterSidebar
          {...sidebarProps}
          idPrefix="mobile-product-filter"
          className="border border-outline-variant/30"
        />
      </section>

      <section id="catalog" className="px-6 py-20 lg:ml-72 lg:px-16 lg:py-28">
        <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-headline-lg text-on-surface">
              Nuevas llegadas
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              {filteredProducts.length} de {productsWithVariants.length}{" "}
              productos disponibles
            </p>
            {supportingError && (
              <p className="mt-2 max-w-2xl text-sm text-error">
                Algunos filtros o variantes no se pudieron cargar: {supportingError}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2 text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
              Orden: recomendado
            </span>
            <a
              href="#journal"
              className="rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2 text-label-sm font-semibold uppercase tracking-widest text-primary transition hover:bg-surface-container-high"
            >
              Ver journal
            </a>
          </div>
        </div>

        {highlightedProducts.length > 0 && (
          <div className="mb-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {highlightedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                featured={index === 0}
                compact
                imageFit="contain"
              />
            ))}
          </div>
        )}

        {remainingProducts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {remainingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                imageFit="contain"
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="border border-dashed border-outline-variant/60 bg-surface-container-lowest px-6 py-16 text-center">
            <span
              className="material-symbols-outlined text-5xl text-on-surface-variant/50"
              aria-hidden="true"
            >
              search_off
            </span>
            <h2 className="mt-4 font-display text-headline-md text-on-surface">
              Sin resultados
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Ajusta los filtros para ver mas productos disponibles.
            </p>
          </div>
        )}
      </section>

      <section
        id="atelier"
        className="bg-surface-container px-6 py-24 lg:ml-72 lg:px-16"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-label-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Atelier
          </p>
          <h2 className="mt-4 font-display text-headline-lg text-on-surface">
            Variantes, textura y disponibilidad en una sola vista
          </h2>
          <p className="mt-4 text-body-lg text-on-surface-variant">
            Cada card toma los datos reales del producto y sus variantes:
            imagen, color, talla, material y estado. El estilo es editorial,
            pero la data sigue viva.
          </p>
        </div>
      </section>

      <footer
        id="journal"
        className="border-t border-outline-variant/50 bg-surface-container-low px-6 py-16 lg:ml-72 lg:px-16"
      >
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="font-display text-headline-lg text-primary">
              ELEVATION
            </span>
            <p className="mt-4 max-w-xl text-body-md text-on-surface-variant">
              Catalogo dinamico para presentar productos con una estetica de
              moda, sin perder la estructura modular del frontend.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-label-sm font-semibold uppercase tracking-widest text-on-surface">
              Navegacion
            </span>
            <a
              className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
              href="#catalog"
            >
              Coleccion
            </a>
            <a
              className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
              href="#atelier"
            >
              Atelier
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-label-sm font-semibold uppercase tracking-widest text-on-surface">
              Gestion
            </span>
            <a
              className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
              href="/login"
            >
              Iniciar sesion
            </a>
            <a
              className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
              href="/products"
            >
              Productos
            </a>
          </div>
        </div>
      </footer>

      <a
        href="#catalog"
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition hover:scale-105"
        aria-label="Ver catalogo"
      >
        <span className="material-symbols-outlined text-2xl" aria-hidden="true">
          shopping_cart
        </span>
      </a>
    </main>
  );
}

export default LandingPage;
