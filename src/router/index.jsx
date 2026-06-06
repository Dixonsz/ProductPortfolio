import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../pages/MainLayout";
import CategoryPage from "../pages/CategoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <div>Dashboard</div>,
      },
      {
        path: "products",
        element: <div>Productos</div>,
      },
      {
        path: "categories",
        element: <CategoryPage />,
      },
    ],
  },
]);
