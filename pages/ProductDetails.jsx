import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import Loader from "../components/common/Loader";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useauth";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
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

  if (error) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/products" className="text-fern font-medium hover:underline">
          Back to Products
        </Link>
      </section>
    );
  }

  const image = product.images?.[0] || "https://via.placeholder.com/500";

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/products" className="text-fern hover:underline text-sm mb-4 inline-block">
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
        <img
          src={image}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg"
        />

        <div>
          <h1 className="text-2xl font-bold text-dark mb-2">{product.name}</h1>
          {product.category?.name && (
            <p className="text-sm text-forest mb-3">{product.category.name}</p>
          )}
          <p className="text-2xl font-semibold text-fern mb-4">${product.price}</p>
          <p className="text-dark mb-4">{product.description}</p>
          <p className="text-sm text-forest mb-3">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
          
        <Button onClick={handleAddToCart} isLoading={isAdding} className="mt-4">
            Add to Cart
          </Button>
        </div>
      </div>
    </section>
  );
}