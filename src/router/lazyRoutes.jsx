import { lazy, Suspense } from "react";

const MainLayout = lazy(() => import("../pages/MainLayout"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const BrandPage = lazy(() => import("../pages/BrandPage"));
const GenderPage = lazy(() => import("../pages/GenderPage"));
const StatePage = lazy(() => import("../pages/StatePage"));
const SizePage = lazy(() => import("../pages/SizePage"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const ProductVariantPage = lazy(() => import("../pages/ProductVariantPage"));

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

export function LazyLoginPage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <LoginPage />
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
export function LazyGenderPage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <GenderPage />
    </Suspense>
  );
}

export function LazyStatePage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <StatePage />
    </Suspense>
  );
}
export function LazySizePage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <SizePage />
    </Suspense>
  );
}
export function LazyProductPage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <ProductPage />
    </Suspense>
  );
}

export function LazyProductVariantPage() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <ProductVariantPage />
    </Suspense>
  );
}
