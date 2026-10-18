import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

import { searchProducts } from "../../products/api/products";
import useApi from "../../../hooks/useApi";
import ContentState from "../../../components/shared/ContentState";
import DiscountBadge from "../../products/components/DiscountBadge";
import SearchBar from "../components/SearchBar";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = (searchParams.get("search_query") ?? "").trim();

  const loadSearchResults = useCallback(
    (signal) => searchProducts(query, signal),
    [query],
  );

  const { data, isLoading, error, refetch } = useApi(loadSearchResults);
  const products = data ?? [];

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl min-w-0 px-4 py-6 font-default sm:px-6 sm:py-8 lg:px-8">
      <div className="flex items-center w-full max-w-4xl min-w-0 gap-2 mx-auto mb-6 sm:gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex items-center justify-center text-gray-800 transition bg-gray-100 rounded-lg h-11 w-11 shrink-0 hover:bg-gray-200"
        >
          <IoMdArrowRoundBack size={22} />
        </button>

        <SearchBar key={query} />
      </div>

      <section>
        <header className="mb-5">
          <h1 className="text-xl font-bold text-gray-900 font-heading sm:text-2xl">
            Search Results
          </h1>

          {query && !isLoading && !error && (
            <p className="mt-1 text-sm text-gray-600 break-words sm:text-base">
              {products.length} {products.length === 1 ? "result" : "results"}{" "}
              for{" "}
              <span className="font-semibold text-gray-900">
                &quot;{query}&quot;
              </span>
            </p>
          )}
        </header>

        {!query ? (
          <div className="px-4 py-12 text-center bg-white border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 sm:text-base">
              Enter a product name in the search bar to get started.
            </p>
          </div>
        ) : (
          <ContentState
            isLoading={isLoading}
            error={error}
            isEmpty={!isLoading && !error && products.length === 0}
            emptyMessage={`No products found for "${query}". Try a different search.`}
            onRetry={refetch}
          >
            <div className="grid items-stretch grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <DiscountBadge key={product.id} productData={product} />
              ))}
            </div>
          </ContentState>
        )}
      </section>
    </main>
  );
};

export default SearchResultsPage;
