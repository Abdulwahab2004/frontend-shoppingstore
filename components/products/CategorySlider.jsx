import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { getCategories } from "../../services/categoryService";

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

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

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction * 220, behavior: "smooth" });
  };

  if (categories.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-xl font-bold text-dark mb-4">Shop by Category</h2>

      <div className="relative group/slider">
        {categories.length > 6 && (
          <>
            <button
              onClick={() => scroll(-1)}
              className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-sage shadow-sm items-center justify-center text-dark opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 hover:bg-sage/20"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-sage shadow-sm items-center justify-center text-dark opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 hover:bg-sage/20"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-sage group-hover:border-fern shadow-sm transition-all duration-200 group-hover:scale-105">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-sage/20 flex items-center justify-center">
                    <ImageOff size={20} className="text-sage" />
                  </div>
                )}
              </div>
              <span className="text-sm text-dark text-center w-20 truncate group-hover:text-fern transition-colors duration-200">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}