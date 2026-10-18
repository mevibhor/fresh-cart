import { getCategories } from "../api/products";
import useApi from "../hooks/useApi";
import ContentState from "./ContentState";
import CategoryCard from "./CategoryCard";

const TopCategories = () => {
  const { data, isLoading, error, refetch } = useApi(getCategories);
  const categories = data ?? [];

  return (
    <section className="w-full max-w-7xl px-4 py-5 font-default sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-gray-900 sm:text-2xl">
          Top Categories
        </h2>
      </div>

      <ContentState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && categories.length === 0}
        emptyMessage="No categories available."
        onRetry={refetch}
      >
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} compact />
          ))}
        </div>
      </ContentState>
    </section>
  );
};

export default TopCategories;
