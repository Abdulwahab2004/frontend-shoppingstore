import { memo, useState } from "react";

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const product = item.product;
  const image = product?.images?.[0] || "https://via.placeholder.com/100";

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(product._id, newQty);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white border border-sage rounded-lg p-4">
      <img
        src={image}
        alt={product?.name}
        className="w-20 h-20 object-cover rounded-lg"
        loading="lazy"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-dark font-medium truncate">{product?.name}</h3>
        <p className="text-fern font-semibold">${product?.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating}
          className="w-8 h-8 rounded-lg border border-sage hover:bg-sage/20 disabled:opacity-40 transition-colors duration-200"
        >
          −
        </button>
        <span className="w-8 text-center text-dark">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          className="w-8 h-8 rounded-lg border border-sage hover:bg-sage/20 disabled:opacity-40 transition-colors duration-200"
        >
          +
        </button>
      </div>

      <button
        onClick={() => onRemove(product._id)}
        className="text-red-600 hover:underline text-sm"
      >
        Remove
      </button>
    </div>
  );
}

export default memo(CartItem);