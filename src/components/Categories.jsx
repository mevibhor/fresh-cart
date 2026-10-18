import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import useApi from "../hooks/useApi";
import ContentState from "./ContentState";
import ItemsCard from "./ItemsCard";

const Categories = () => {
  const { data, isLoading, error, refetch } = useApi(getProducts);

  // The API data is null until the first request succeeds.
  const products = data ?? [];

  const groupedProducts = products.reduce((groups, product) => {
    const category = product.category || "other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(product);

    return groups;
  }, {});

  const categories = Object.entries(groupedProducts);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 font-default sm:px-6">
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

          return (
            <section key={category}>
              <div className="sticky top-16 z-20 mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-[#F2F2F2] px-4 py-3 shadow-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <h2 className="truncate font-heading text-lg font-semibold text-gray-800 sm:text-xl">
                    {categoryName}
                  </h2>

                  <span className="shrink-0 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                    {categoryProducts.length}
                  </span>
                </div>

                <Link
                  to={`/details/${category}`}
                  className="ml-3 shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
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
