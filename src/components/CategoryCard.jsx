import { Link } from "react-router-dom";
import { FiTag } from "react-icons/fi";

const CategoryCard = ({ category, compact = false }) => {
  const categoryName = category.name || category.slug;

  return (
    <Link
      to={`/details/${category.slug}`}
      aria-label={`Browse ${categoryName} products`}
      className={`group flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition duration-200 hover:border-blue-300 hover:shadow-md ${
        compact ? "min-w-[190px] sm:min-w-[210px]" : "w-full"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
        <FiTag size={22} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <h3 className="break-words text-sm font-semibold capitalize text-gray-800 sm:text-base">
          {categoryName.replaceAll("-", " ")}
        </h3>
        <p className="mt-1 text-xs text-gray-500">Explore products</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
