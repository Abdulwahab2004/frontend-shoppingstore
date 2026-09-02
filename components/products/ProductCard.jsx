import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../hooks/useauth";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [isAdding, setIsAdding] = useState(false);

  const image = product.images?.[0] || "https://via.placeholder.com/300";
  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock === 0;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    inWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(product._id);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative bg-white border border-sage/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block"
    >
      <div className="relative overflow-hidden bg-sage/10">
        <img
          src={image}
          alt={product.name}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-200"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={16}
            className={inWishlist ? "fill-red-500 text-red-500" : "text-dark"}
          />
        </button>

        {outOfStock && (
          <span className="absolute top-2 left-2 bg-dark/80 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        {/* Quick add-to-cart bar — slides up on hover (desktop) */}
        {!outOfStock && (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="absolute bottom-0 left-0 right-0 bg-fern text-white text-sm font-medium py-2 flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-forest disabled:opacity-70"
          >
            <ShoppingCart size={14} />
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>

      <div className="p-3">
        {product.category?.name && (
          <p className="text-[11px] text-forest uppercase tracking-wide mb-0.5">
            {product.category.name}
          </p>
        )}
        <h3 className="text-dark font-medium text-sm truncate">{product.name}</h3>
        <p className="text-fern font-bold mt-1">${product.price}</p>
      </div>
    </Link>
  );
}

export default memo(ProductCard);