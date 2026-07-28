import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/products/SearchBar";
import Filters from "../components/products/Filters";
import CategorySlider from "../components/products/CategorySlider";
import Loader from "../components/common/Loader";
import heroImage from "../src/assets/images/hero.jpg";
import Pagination from "../components/products/Pagination";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [queryParams, setQueryParams] = useState({ limit: 8 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


 useEffect(() => {
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts({ ...queryParams, page, limit: 8 });
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };
  fetchProducts();
}, [queryParams, page]);

 const handleSearch = (search) => {
  setPage(1);
  setQueryParams((prev) => ({ ...prev, search }));
};

const handleFilter = ({ minPrice, maxPrice }) => {
  setPage(1);
  setQueryParams((prev) => ({ ...prev, minPrice, maxPrice }));
};

  return (
    <div>
      <section
  className="relative bg-cover bg-center bg-no-repeat min-h-[500px]"
  style={{ backgroundImage: `url(${heroImage})` }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40"></div>
  {/* Use bg-black/30, bg-black/40, bg-white/50, etc. */}

  <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Shop Smarter, Live Better
          </h1>
          <p className="text-base md:text-lg text-white mb-8">
            Discover quality products at prices you'll love.
          </p>
          <Link
            to="/products"
            className="inline-block bg-fern text-white px-6 py-3 rounded-lg font-medium hover:bg-forest transition-colors duration-200"
          >
            Browse All Products
          </Link>
        </div>
      </section>

      <CategorySlider />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-dark mb-6">Featured Products</h2>

        <SearchBar onSearch={handleSearch} />
        <Filters onFilter={handleFilter} />

        {isLoading && <Loader />}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!isLoading && !error && products.length === 0 && (
          <p className="text-forest">No products found.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
         <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </div>
  );
}