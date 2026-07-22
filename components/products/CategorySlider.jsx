import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        // silently fail — slider just won't show if categories can't load
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-dark mb-4">Shop by Category</h2>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat.slug}`}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-sage group-hover:border-fern transition-colors duration-200">
              <img
                src={cat.image || "https://via.placeholder.com/100"}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-dark text-center w-20 truncate">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}