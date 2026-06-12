import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  LazyBrandPage,
  LazyCategoryPage,
  LazyDashboardPage,
  LazyGenderPage,
  LazyLandingPage,
  LazyLoginPage,
  LazyMainLayout,
  LazyProductPage,
  LazyProductVariantPage,
  LazySizePage,
  LazyStatePage,
} from "./lazyRoutes";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LazyLandingPage />,
  },
  {
    path: "/landing",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/login",
    element: <LazyLoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <LazyMainLayout />,
        children: [
          {
            path: "dashboard",
            element: <LazyDashboardPage />,
          },
          {
            path: "products",
            element: <LazyProductPage />,
          },
          {
            path: "products/:productId/variants",
            element: <LazyProductVariantPage />,
          },
          {
            path: "categories",
            element: <LazyCategoryPage />,
          },
          {
            path: "brands",
            element: <LazyBrandPage />,
          },
          {
            path: "genders",
            element: <LazyGenderPage />,
          },
          {
            path: "states",
            element: <LazyStatePage />,
          },
          {
            path: "sizes",
            element: <LazySizePage />,
          },
        ],
      },
    ],
  },
]);
