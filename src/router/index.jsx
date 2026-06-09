import { createBrowserRouter } from "react-router-dom";
import {
  LazyCategoryPage,
  LazyBrandPage,
  LazyDashboardPage,
  LazyGenderPage,
  LazyStatePage,
  LazySizePage,
  LazyMainLayout,
  LazyProductPage,
  LazyProductVariantPage,
} from "./lazyRoutes";

export const router = createBrowserRouter([
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
]);
