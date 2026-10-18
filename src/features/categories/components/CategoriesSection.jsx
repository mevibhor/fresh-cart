import { useContext } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../products/api/products";
import { CartContext } from "../../cart/context/Cart";
import useApi from "../../../hooks/useApi";
import ContentState from "../../../components/shared/ContentState";
import ProductCard from "../../products/components/ProductCard";

const CategoriesSection = () => {
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
    <div className="w-full px-4 py-6 mx-auto space-y-8 max-w-7xl font-default sm:px-6 lg:px-8">
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
                <div className="flex flex-wrap items-center min-w-0 gap-2 sm:gap-3">
                  <h2 className="text-lg font-semibold text-gray-800 font-heading sm:text-xl">
                    {categoryName}
                  </h2>

                  <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-md shrink-0">
                    {categoryProducts.length} products
                  </span>

                  {cartCount > 0 && (
                    <span
                      className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md shrink-0"
                      aria-label={`${cartCount} items from ${categoryName} in your bag`}
                    >
                      {cartCount} in bag
                    </span>
                  )}
                </div>

                <Link
                  to={`/details/${category}`}
                  className="text-sm font-semibold text-blue-700 shrink-0 hover:text-blue-900 hover:underline"
                >
                  See All
                </Link>
              </div>

              <div className="grid items-stretch grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} productData={product} />
                ))}
              </div>
            </section>
          );
        })}
      </ContentState>
    </div>
  );
};

export default CategoriesSection;
