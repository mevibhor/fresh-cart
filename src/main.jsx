import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../src/components/layout/AppLayout";
import HomePage from "./features/home/pages/HomePage";
import SearchResultsPage from "./features/search/pages/SearchResultsPage";
import CategoriesPage from "./features/categories/pages/CategoriesPage";
import BagPage from "./features/cart/pages/BagPage";
import OrdersPage from "./features/orders/pages/OrdersPage";
import CategoryDetailPage from "./features/categories/pages/CategoryDetailPage";
import ProductDetailsPage from "./features/products/pages/ProductDetailsPage";
import CheckoutPage from "./features/checkout/pages/CheckoutPage";
import { CartProvider } from "../src/features/cart/context/Cart";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchResultsPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "bag",
        element: <BagPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "details/:categoryId",
        element: <CategoryDetailPage />,
      },
      {
        path: "product/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);
