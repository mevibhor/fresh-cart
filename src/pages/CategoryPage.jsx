import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";
import ContentState from "../components/ContentState";
import { getCategories } from "../api/products";
import useApi from "../hooks/useApi";

const CategoryPage = () => {
  const { data, isLoading, error, refetch } = useApi(getCategories);
  const categories = data ?? [];

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 font-default sm:px-6 sm:py-10">
        <header className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
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
    </>
  );
};

export default CategoryPage;
