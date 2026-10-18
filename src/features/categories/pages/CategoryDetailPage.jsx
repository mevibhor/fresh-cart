import { useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getProductsByCategory } from "../../../features/products/api/products";
import useApi from "../../../hooks/useApi";
import ContentState from "../../../components/shared/ContentState";
import { CartContext } from "../../cart/context/Cart";
import ProductCard from "../../products/components/ProductCard";

const CategoryDetailPage = () => {
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

  const categoryCartCount = cartItems.reduce((total, item) => {
    if (item.category === categoryId) {
      return total + Number(item.quantity || 0);
    }

    return total;
  }, 0);

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-5 font-default sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-[#F2F2F2] px-3 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="p-2 text-gray-700 transition rounded-lg shrink-0 hover:bg-white"
        >
          <IoMdArrowRoundBack size={23} />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 break-words font-heading sm:text-2xl">
            {categoryName}
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Browse products in this category
          </p>
        </div>

        {categoryCartCount > 0 && (
          <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md shrink-0">
            {categoryCartCount} {categoryCartCount === 1 ? "item" : "items"} in
            bag
          </span>
        )}
      </header>

      <ContentState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && products.length === 0}
        emptyMessage={`No products found in ${categoryName}.`}
        onRetry={refetch}
      >
        <div className="grid items-stretch grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} productData={product} />
          ))}
        </div>
      </ContentState>
    </main>
  );
};

export default CategoryDetailPage;
