import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../pages/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import CategoryPage from "../pages/CategoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
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
