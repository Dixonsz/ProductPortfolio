import { createBrowserRouter } from "react-router-dom";
import {
  LazyCategoryPage,
  LazyBrandPage,
  LazyDashboardPage,
  LazyGenderPage,
  LazyStatePage,
  LazySizePage,
  LazyMainLayout,
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
        element: <div>Productos</div>,
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
