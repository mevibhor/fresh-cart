import { useContext } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../api/products";
import { CartContext } from "../context/Cart";
import useApi from "../hooks/useApi";
import ContentState from "./ContentState";
import ItemsCard from "./ItemsCard";

const Categories = () => {
  const { data, isLoading, error, refetch } = useApi(getProducts);
  const { cartItems } = useContext(CartContext);

  const products = data ?? [];

  // Group all available products by category.
  const groupedProducts = products.reduce((groups, product) => {
    const category = product.category || "other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(product);

    return groups;
  }, {});

  // Count cart quantities for each category.
  const categoryCartCounts = cartItems.reduce((counts, cartItem) => {
    const category = cartItem.category || "other";

    counts[category] = (counts[category] || 0) + Number(cartItem.quantity || 0);

    return counts;
  }, {});

  const categories = Object.entries(groupedProducts);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 font-default sm:px-6 lg:px-8">
      <ContentState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && products.length === 0}
        emptyMessage="No products found."
        onRetry={refetch}
      >
        {categories.map(([category, categoryProducts]) => {
          const categoryName = category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          const cartCount = categoryCartCounts[category] || 0;

          return (
            <section key={category}>
              <div className="sticky top-16 z-20 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-[#F2F2F2] px-4 py-3 shadow-sm">
                <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                  <h2 className="font-heading text-lg font-semibold text-gray-800 sm:text-xl">
                    {categoryName}
                  </h2>

                  <span className="shrink-0 rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                    {categoryProducts.length} products
                  </span>

                  {cartCount > 0 && (
                    <span
                      className="shrink-0 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white"
                      aria-label={`${cartCount} items from ${categoryName} in your bag`}
                    >
                      {cartCount} in bag
                    </span>
                  )}
                </div>

                <Link
                  to={`/details/${category}`}
                  className="shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                >
                  See All
                </Link>
              </div>

              <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {categoryProducts.map((product) => (
                  <ItemsCard key={product.id} productData={product} />
                ))}
              </div>
            </section>
          );
        })}
      </ContentState>
    </div>
  );
};

export default Categories;
