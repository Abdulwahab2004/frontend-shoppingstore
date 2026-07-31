import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import Loader from "../components/common/Loader";

export default function Wishlist() {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();

  const handleRemove = useCallback(
    (productId) => removeFromWishlist(productId),
    [removeFromWishlist]
  );

  if (isLoading) return <Loader />;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-dark mb-6">Your Wishlist</h1>

      {wishlist.products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-forest mb-4">Your wishlist is empty.</p>
          <Link to="/products" className="text-fern font-medium hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlist.products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-sage rounded-lg overflow-hidden"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <h3 className="text-dark font-medium truncate">{product.name}</h3>
                  <p className="text-fern font-semibold mt-1">${product.price}</p>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(product._id)}
                className="w-full text-red-600 text-sm py-2 border-t border-sage hover:bg-red-50 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}