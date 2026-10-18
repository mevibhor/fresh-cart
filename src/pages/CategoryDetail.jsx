import { useCallback, useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";

import { getProductsByCategory } from "../api/products";
import useApi from "../hooks/useApi";
import ContentState from "../components/ContentState";
import ItemsCard from "../components/ItemsCard";
import { CartContext } from "../context/Cart";

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const loadCategoryProducts = useCallback(
    (signal) => getProductsByCategory(categoryId, signal),
    [categoryId],
  );

  const { data, isLoading, error, refetch } = useApi(loadCategoryProducts);

  const products = data ?? [];

  const categoryName = (categoryId ?? "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-5 font-default sm:px-6 sm:py-8">
      <header className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-[#F2F2F2] px-3 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="shrink-0 rounded-lg p-2 text-gray-700 transition hover:bg-white"
        >
          <IoMdArrowRoundBack size={23} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-lg font-bold text-gray-900 sm:text-2xl">
            {categoryName}
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Browse products in this category
          </p>
        </div>

        <NavLink
          to="/bag"
          aria-label={`Shopping bag, ${cartItems.length} items`}
          className="relative shrink-0 rounded-lg p-2 text-gray-800 transition hover:bg-white"
        >
          <FiShoppingBag size={25} />

          {cartItems.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
              {cartItems.length}
            </span>
          )}
        </NavLink>
      </header>

      <ContentState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && products.length === 0}
        emptyMessage={`No products found in ${categoryName}.`}
        onRetry={refetch}
      >
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ItemsCard key={product.id} productData={product} />
          ))}
        </div>
      </ContentState>
    </main>
  );
};

export default CategoryDetail;
