import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

import { searchProducts } from "../api/products";
import useApi from "../hooks/useApi";
import ContentState from "../components/ContentState";
import ItemsCard from "../components/ItemsCard";
import SearchBar from "../components/SearchBar";

const SearchResults = () => {
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
      <div className="mx-auto mb-6 flex w-full max-w-4xl min-w-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800 transition hover:bg-gray-200"
        >
          <IoMdArrowRoundBack size={22} />
        </button>

        <SearchBar key={query} />
      </div>

      <section>
        <header className="mb-5">
          <h1 className="font-heading text-xl font-bold text-gray-900 sm:text-2xl">
            Search Results
          </h1>

          {query && !isLoading && !error && (
            <p className="mt-1 break-words text-sm text-gray-600 sm:text-base">
              {products.length} {products.length === 1 ? "result" : "results"}{" "}
              for <span className="font-semibold text-gray-900">"{query}"</span>
            </p>
          )}
        </header>

        {!query ? (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center">
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
            <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ItemsCard key={product.id} productData={product} />
              ))}
            </div>
          </ContentState>
        )}
      </section>
    </main>
  );
};

export default SearchResults;
