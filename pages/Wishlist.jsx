import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import Loader from "../components/common/Loader";

export default function Wishlist() {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = useCallback(
    async (productId) => {
      setRemovingId(productId);
      try {
        await removeFromWishlist(productId);
      } finally {
        setRemovingId(null);
      }
    },
    [removeFromWishlist]
  );

  if (isLoading) return <Loader />;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={22} className="text-fern" />
        <h1 className="text-2xl font-bold text-dark">Your Wishlist</h1>
        {wishlist.products.length > 0 && (
          <span className="text-sm text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {wishlist.products.length}
          </span>
        )}
      </div>

      {wishlist.products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-sage rounded-xl">
          <Heart size={40} className="mx-auto text-sage mb-3" />
          <p className="text-dark font-medium mb-1">Your wishlist is empty</p>
          <p className="text-forest text-sm mb-5">
            Save items you love to find them here later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 bg-fern text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-forest transition-all duration-200 hover:gap-2.5"
          >
            Browse Products
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlist.products.map((product) => (
            <div
              key={product._id}
              className={`group bg-white border border-sage/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                removingId === product._id ? "opacity-40" : "opacity-100"
              }`}
            >
              <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </Link>

              <div className="p-3">
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-dark font-medium text-sm truncate">{product.name}</h3>
                  <p className="text-fern font-bold mt-1">${product.price}</p>
                </Link>
              </div>

              <button
                onClick={() => handleRemove(product._id)}
                disabled={removingId === product._id}
                className="w-full flex items-center justify-center gap-1.5 text-red-600 text-sm font-medium py-2 border-t border-sage/40 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}