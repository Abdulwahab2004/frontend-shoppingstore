import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Heart, CheckCircle2, Minus, Plus, Package } from "lucide-react";
import { getProductById } from "../services/productService";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useauth";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) return <Loader />;

  if (error || !product) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error || "Product not found"}</p>
        <Link to="/products" className="text-fern font-medium hover:underline">
          Back to Products
        </Link>
      </section>
    );
  }

  const image = product.images?.[0] || "https://via.placeholder.com/500";
  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(product._id, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (inWishlist) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-forest hover:text-fern text-sm mb-6 transition-colors duration-200"
      >
        <ChevronLeft size={16} />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sage/40 max-w-4xl mx-auto">
        <div className="rounded-xl overflow-hidden bg-sage/10">
          <img
            src={image}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </div>

        <div className="flex flex-col">
          {product.category?.name && (
            <span className="text-xs font-medium text-fern uppercase tracking-wide mb-2">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">{product.name}</h1>

          <p className="text-2xl font-bold text-fern mb-4">${product.price}</p>

          <p className="text-dark/80 leading-relaxed mb-4">{product.description}</p>

          <div className="mb-5">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-100 px-3 py-1.5 rounded-full">
                <Package size={13} /> Out of Stock
              </span>
            ) : lowStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-full">
                <Package size={13} /> Only {product.stock} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                <CheckCircle2 size={13} /> In Stock
              </span>
            )}
          </div>

          {!outOfStock && (
            <div className="mb-5">
              <label className="block text-xs font-medium text-forest mb-2">Quantity</label>
              <div className="inline-flex items-center gap-1 bg-sage/10 rounded-full p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-dark hover:bg-white transition-colors duration-200"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-medium text-dark">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-dark hover:bg-white transition-colors duration-200"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-auto">
            <Button
              onClick={handleAddToCart}
              isLoading={isAdding}
              disabled={justAdded || outOfStock}
              fullWidth
            >
              {justAdded ? (
                <span className="flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={16} /> Added to Cart
                </span>
              ) : outOfStock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </Button>

            <button
              onClick={handleWishlistToggle}
              className={`w-11 h-11 flex-shrink-0 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                inWishlist
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-sage text-dark hover:bg-sage/20"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={18} className={inWishlist ? "fill-red-500" : ""} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}