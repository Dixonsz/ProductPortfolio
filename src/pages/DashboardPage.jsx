import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";

const metrics = [
  {
    label: "Productos activos",
    value: "124",
    detail: "8 nuevas referencias",
    icon: "inventory_2",
    tone: "text-primary",
  },
  {
    label: "Categorías",
    value: "18",
    detail: "Listas para catálogo",
    icon: "category",
    tone: "text-secondary",
  },
  {
    label: "Stock bajo",
    value: "12",
    detail: "Requieren revisión",
    icon: "pending_actions",
    tone: "text-error",
  },
  {
    label: "Materiales",
    value: "34",
    detail: "Variantes registradas",
    icon: "texture",
    tone: "text-primary",
  },
];

const recentProducts = [
  {
    id: 1,
    product: "Vestido lino arena",
    category: "Prêt-à-porter",
    stock: "42 unidades",
    status: (
      <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-semibold text-primary">
        En stock
      </span>
    ),
  },
  {
    id: 2,
    product: "Blusa seda rosa",
    category: "Esenciales",
    stock: "15 unidades",
    status: (
      <span className="rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-on-secondary-container">
        Bajo stock
      </span>
    ),
  },
  {
    id: 3,
    product: "Abrigo cachemira",
    category: "Invierno",
    stock: "5 unidades",
    status: (
      <span className="rounded-full bg-error-container px-3 py-1 text-label-sm font-semibold text-on-error-container">
        Crítico
      </span>
    ),
  },
];

const columns = [
  { label: "Producto", key: "product" },
  { label: "Categoría", key: "category" },
  { label: "Stock", key: "stock" },
  { label: "Estado", key: "status" },
];

function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">
            Resumen
          </p>
          <h2 className="font-display text-headline-lg text-on-surface">
            Pulso del portafolio
          </h2>
          <p className="mt-2 max-w-2xl text-body-lg text-on-surface-variant">
            Una vista sobria para revisar inventario, categorías y señales operativas.
          </p>
        </div>
        <Button icon="add">Nuevo producto</Button>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} tone="muted" className="flex min-h-40 flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
                  {metric.label}
                </p>
                <p className="mt-2 font-display text-headline-lg text-on-surface">
                  {metric.value}
                </p>
              </div>
              <span className={`material-symbols-outlined ${metric.tone}`}>
                {metric.icon}
              </span>
            </div>
            <p className={`mt-6 text-label-sm font-semibold ${metric.tone}`}>
              {metric.detail}
            </p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="font-display text-headline-md">Rendimiento mensual</h3>
              <p className="text-on-surface-variant">Distribución visual de actividad por mes.</p>
            </div>
            <div className="flex gap-4 text-label-sm font-semibold text-on-surface-variant">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                Productos
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-secondary-container" />
                Categorías
              </span>
            </div>
          </div>
          <div className="flex h-64 items-end gap-4">
            {[60, 76, 92, 48, 84, 100].map((height, index) => (
              <div key={height} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-48 w-full items-end gap-1">
                  <div
                    className="w-1/2 rounded-t-sm bg-primary/25 transition hover:bg-primary"
                    style={{ height: `${height}%` }}
                  />
                  <div
                    className="w-1/2 rounded-t-sm bg-secondary-container/70 transition hover:bg-secondary-container"
                    style={{ height: `${Math.max(height - 20 + index * 4, 28)}%` }}
                  />
                </div>
                <span className="text-label-sm font-semibold text-on-surface-variant">
                  {["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"][index]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card tone="accent" className="relative overflow-hidden xl:col-span-4">
          <div className="relative z-10">
            <span className="rounded-full bg-white/60 px-3 py-1 text-label-sm font-semibold uppercase tracking-widest text-secondary">
              Alerta
            </span>
            <h3 className="mt-4 font-display text-headline-md text-on-secondary-fixed">
              Reposición sugerida
            </h3>
            <p className="mt-2 text-on-secondary-fixed-variant">
              Revisa productos con inventario crítico antes de publicar nuevas campañas.
            </p>
          </div>
          <Button className="relative z-10 mt-8" icon="visibility">
            Ver inventario
          </Button>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-headline-md">Productos recientes</h3>
        </div>
        <Table columns={columns} data={recentProducts} />
      </section>
    </div>
  );
}

export default DashboardPage;
