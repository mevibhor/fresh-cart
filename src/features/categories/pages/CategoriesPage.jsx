import CategoryCard from "../components/CategoryCard";
import ContentState from "../../../components/shared/ContentState";
import { getCategories } from "../../../features/products/api/products";
import useApi from "../../../hooks/useApi";

const CategoriesPage = () => {
  const { data, isLoading, error, refetch } = useApi(getCategories);
  const categories = data ?? [];

  return (
    <main className="w-full px-4 py-6 mx-auto max-w-7xl font-default sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading sm:text-3xl">
          All Categories
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Browse products by category.
        </p>
      </header>

      <ContentState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && categories.length === 0}
        emptyMessage="No categories available."
        onRetry={refetch}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </ContentState>
    </main>
  );
};

export default CategoriesPage;
