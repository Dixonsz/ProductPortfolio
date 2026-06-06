import { lazy, Suspense } from "react";

const MainLayout = lazy(() => import("../pages/MainLayout"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const BrandPage = lazy(() => import("../pages/BrandPage"));

function RouteFallback() {
  return <p className="text-on-surface-variant">Cargando vista...</p>;
}

export function LazyMainLayout() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <MainLayout />
    </Suspense>
  );
}

export function LazyDashboardPage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <DashboardPage />
    </Suspense>
  );
}

export function LazyCategoryPage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <CategoryPage />
    </Suspense>
  );
}

export function LazyBrandPage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <BrandPage />
    </Suspense>
  );
}
