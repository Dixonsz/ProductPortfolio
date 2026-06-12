import { createBrowserRouter } from "react-router-dom";
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
    path: "/landing",
    element: <LazyLandingPage />,
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
            index: true,
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
