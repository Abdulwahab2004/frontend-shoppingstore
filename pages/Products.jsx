import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/products/SearchBar";
import Filters from "../components/products/Filters";
import Pagination from "../components/products/Pagination";
import SkeletonCard from "../components/common/SkeletonCard";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [queryParams, setQueryParams] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = { ...queryParams, page, limit: 12 };
        if (categorySlug) {
          params.category = categorySlug;
        }
        const data = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.pages);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [queryParams, categorySlug, page]);

  const handleSearch = useCallback((search) => {
    setPage(1);
    setQueryParams((prev) => ({ ...prev, search }));
  }, []);

  const handleFilter = useCallback(({ minPrice, maxPrice }) => {
    setPage(1);
    setQueryParams((prev) => ({ ...prev, minPrice, maxPrice }));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-dark mb-6">
        {categorySlug ? `Products in "${categorySlug}"` : "Products"}
      </h1>

      <SearchBar onSearch={handleSearch} />
      <Filters onFilter={handleFilter} />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {!error && products.length === 0 && (
            <p className="text-forest">No products found.</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}