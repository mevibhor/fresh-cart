import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";
import CategoryDetail from "./pages/CategoryDetail";
import ItemPage from "./pages/ItemPage";
import Bag from "./pages/Bag";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";

import { CartProvider } from "./context/Cart";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchResults />,
      },
      {
        path: "categories",
        element: <CategoryPage />,
      },
      {
        path: "bag",
        element: <Bag />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "details/:categoryId",
        element: <CategoryDetail />,
      },
      {
        path: "product/:productId",
        element: <ItemPage />,
      },
      {
        path: "checkout",
        element: <Checkout />,
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
