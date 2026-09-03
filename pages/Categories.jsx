import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, ImageOff } from "lucide-react";
import { getCategories } from "../services/categoryService";
import SkeletonCard from "../components/common/SkeletonCard";

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

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <LayoutGrid size={22} className="text-fern" />
        <h1 className="text-2xl font-bold text-dark">Categories</h1>
        {!isLoading && categories.length > 0 && (
          <span className="text-sm text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {categories.length}
          </span>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {!error && categories.length === 0 && (
            <div className="text-center py-20 bg-white border border-dashed border-sage rounded-xl">
              <LayoutGrid size={36} className="mx-auto text-sage mb-3" />
              <p className="text-dark font-medium mb-1">No categories yet</p>
              <p className="text-forest text-sm">Check back soon for new categories.</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-sage/20 flex items-center justify-center">
                    <ImageOff size={28} className="text-sage" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent transition-all duration-300 group-hover:from-dark/90" />

                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <span className="text-white font-semibold text-base text-center px-2 transition-transform duration-300 group-hover:-translate-y-1">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}