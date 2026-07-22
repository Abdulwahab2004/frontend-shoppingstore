import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/products/SearchBar";
import Filters from "../components/products/Filters";
import Loader from "../components/common/Loader";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts(queryParams);
        setProducts(data.products);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [queryParams]);

  const handleSearch = (search) => {
    setQueryParams((prev) => ({ ...prev, search }));
  };

  const handleFilter = ({ minPrice, maxPrice }) => {
    setQueryParams((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-dark mb-6">Products</h1>

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
    </section>
  );
}