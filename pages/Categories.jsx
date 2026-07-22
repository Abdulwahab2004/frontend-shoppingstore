import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import Loader from "../components/common/Loader";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-dark mb-6">Categories</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!error && categories.length === 0 && (
        <p className="text-forest">No categories available yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat.slug}`}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            <img
              src={cat.image || "https://via.placeholder.com/300"}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/60 transition-colors duration-200 flex items-center justify-center">
              <span className="text-white font-semibold text-lg text-center px-2">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}