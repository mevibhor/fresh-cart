import SearchBar from "../components/SearchBar";
import TopCategories from "../components/TopCategories";
import Categories from "../components/Categories";

const Home = () => {
  return (
    <div className="w-full min-w-0">
      <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <SearchBar />
        </div>
      </div>

      <TopCategories />
      <Categories />
    </div>
  );
};

export default Home;
