import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

const SearchBar = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(
    () => searchParams.get("search_query") ?? "",
  );
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      return;
    }

    const params = new URLSearchParams({
      search_query: query,
    });

    navigate(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex items-center w-full min-w-0 gap-2 mx-auto font-default"
    >
      <input
        type="search"
        name="search_query"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="for eg: milk, meat, eggs, rolex etc...."
        aria-label="Search products"
        className="h-11 min-w-0 flex-1 rounded-lg border border-gray-200 bg-[#F2F2F2] px-3 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:px-4 sm:text-base"
      />

      <button
        type="submit"
        aria-label="Search"
        disabled={!search.trim()}
        className="flex items-center justify-center text-xl text-white transition bg-blue-600 rounded-lg h-11 w-11 shrink-0 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IoIosSearch aria-hidden="true" />
      </button>
    </form>
  );
};

export default SearchBar;
