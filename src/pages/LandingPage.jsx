import { useEffect, useMemo, useState } from "react";
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

const PRODUCTS_PER_PAGE = 10;

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
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const firstProductIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    firstProductIndex,
    firstProductIndex + PRODUCTS_PER_PAGE,
  );
  const pageRangeLabel =
    filteredProducts.length > 0
      ? `${firstProductIndex + 1}-${firstProductIndex + paginatedProducts.length}`
      : "0";
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
        onHide={() => setShowDesktopFilters(false)}
        className={`fixed left-0 top-0 z-40 h-full w-72 overflow-y-auto border-r pt-28 ${
          showDesktopFilters ? "hidden lg:block" : "hidden"
        }`}
      />

      {!showDesktopFilters && (
        <button
          type="button"
          onClick={() => setShowDesktopFilters(true)}
          className="fixed left-6 top-24 z-50 hidden h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl transition hover:bg-primary/90 lg:inline-flex"
          aria-label="Mostrar filtros"
          title="Mostrar filtros"
        >
          <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
            tune
          </span>
        </button>
      )}

      <header
        className={`relative min-h-[760px] overflow-hidden pt-20 ${
          showDesktopFilters ? "lg:ml-72" : ""
        }`}
      >
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
                href="https://wa.me/50684147627?text=Hola,%20me%20interesa%20comprar.%20Quiero%20ver%20las%20opciones%20disponibles."
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-9 text-label-sm font-semibold uppercase tracking-widest text-on-primary transition hover:bg-primary/90"
                target="_blank" rel="noopener noreferrer"
                
              >
                 <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="mr-2 h-5 w-5"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.120 1.518 5.854L.057 23.428a.75.75 0 0 0 .916.919l5.701-1.493A11.951 11.951 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.516-5.21-1.415l-.374-.22-3.384.887.893-3.294-.242-.382A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>

                Consultar por WhatsApp
              </a>
            
            </div>
          </div>
        </div>
      </header>

      <section className="bg-surface-container-low px-6 py-8 lg:hidden">
        {showMobileFilters ? (
          <ProductFilterSidebar
            {...sidebarProps}
            idPrefix="mobile-product-filter"
            onHide={() => setShowMobileFilters(false)}
            className="border border-outline-variant/30"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-label-sm font-semibold uppercase tracking-widest text-on-primary transition hover:bg-primary/90"
            aria-label="Mostrar filtros"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              tune
            </span>
            Mostrar filtros
          </button>
        )}
      </section>

      <section
        id="catalog"
        className={`px-6 py-20 lg:px-16 lg:py-28 ${
          showDesktopFilters ? "lg:ml-72" : ""
        }`}
      >
        <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-headline-lg text-on-surface">
              Nuevas Colecciones
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              {filteredProducts.length} de {productsWithVariants.length}{" "}
              productos disponibles
            </p>
            {filteredProducts.length > 0 && (
              <p className="mt-1 text-label-sm text-on-surface-variant/70">
                Mostrando {pageRangeLabel} de {filteredProducts.length}
              </p>
            )}
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

        {paginatedProducts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                imageFit="contain"
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-outline-variant/30 pt-6 sm:flex-row">
            <p className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
              Pagina {safeCurrentPage} de {totalPages}
            </p>
            <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Pagina anterior"
                title="Pagina anterior"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  chevron_left
                </span>
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isActivePage = pageNumber === safeCurrentPage;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-11 min-w-11 rounded-full px-3 text-label-sm font-semibold transition ${
                      isActivePage
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant/40 bg-surface-container text-on-surface-variant hover:border-primary hover:text-primary"
                    }`}
                    aria-label={`Ir a pagina ${pageNumber}`}
                    aria-current={isActivePage ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Pagina siguiente"
                title="Pagina siguiente"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  chevron_right
                </span>
              </button>
            </div>
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
        className={`bg-surface-container px-6 py-24 lg:px-16 ${
          showDesktopFilters ? "lg:ml-72" : ""
        }`}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-label-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Amar y Ya
          </p>
          <h2 className="mt-4 font-display text-headline-lg text-on-surface">
            Encuentra tu opción ideal en segundos
          </h2>
          <p className="mt-4 text-body-lg text-on-surface-variant">
            Visualiza cada prenda con sus colores, tallas, materiales y disponibilidad actualizada. Una experiencia pensada para que descubras cada detalle, elijas con confianza y encuentres justo lo que buscas.
          </p>
        </div>
      </section>

      <footer
        id="journal"
        className={`border-t border-outline-variant/50 bg-surface-container-low px-6 py-16 lg:px-16 ${
          showDesktopFilters ? "lg:ml-72" : ""
        }`}
      >
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="font-display text-headline-lg text-primary">
              Amar y Ya
            </span>
            <p className="mt-4 max-w-xl text-body-md text-on-surface-variant">
           Explora un catálogo visual, moderno y fácil de usar, diseñado para que descubras productos, compares opciones y compres con mayor confianza.
            </p>
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
