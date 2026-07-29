import { memo } from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const image = product.images?.[0] || "https://via.placeholder.com/300";

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white border border-sage rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 block"
    >
      <img src={image} alt={product.name} className="w-full h-40 object-cover" loading="lazy" />
      <div className="p-3">
        <h3 className="text-dark font-medium truncate">{product.name}</h3>
        <p className="text-fern font-semibold mt-1">${product.price}</p>
        {product.category?.name && (
          <p className="text-xs text-forest mt-1">{product.category.name}</p>
        )}
      </div>
    </Link>
  );
}

export default memo(ProductCard);