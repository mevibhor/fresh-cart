import SearchBar from "../../search/components/SearchBar";
import TopCategories from "../../home/components/TopCategories";
import CategoriesSection from "../../categories/components/CategoriesSection";

const HomePage = () => {
  return (
    <div className="w-full min-w-0">
      <div className="w-full px-4 pt-5 mx-auto max-w-7xl sm:px-6">
        <div className="w-full mx-auto">
          <SearchBar />
        </div>
      </div>

      <TopCategories />
      <CategoriesSection />
    </div>
  );
};

export default HomePage;
