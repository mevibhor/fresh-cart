import { getCategories } from "../../products/api/products";
import useApi from "../../../hooks/useApi";
import ContentState from "../../../components/shared/ContentState";
import CategoryCard from "../../../features/categories/components/CategoryCard";

const TopCategories = () => {
  const { data, isLoading, error, refetch } = useApi(getCategories);
  const categories = data ?? [];

  return (
    <section className="w-full px-4 py-5 mx-auto max-w-7xl font-default sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 font-heading sm:text-2xl">
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
        <div className="flex gap-3 px-4 pb-2 -mx-4 overflow-x-auto no-scrollbar sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} compact />
          ))}
        </div>
      </ContentState>
    </section>
  );
};

export default TopCategories;
