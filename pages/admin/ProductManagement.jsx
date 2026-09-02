import { useEffect, useState, useCallback } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import ProductFormModal from "../admin/ProductFormModal";
import Loader from "../../components/common/Loader";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    if (editingProduct) {
      await updateProduct(editingProduct._id, formData);
    } else {
      await createProduct(formData);
    }
    setShowModal(false);
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark">Product Management</h1>
        <button
          onClick={handleAddClick}
          className="bg-fern text-white px-4 py-2 rounded-lg hover:bg-forest transition-colors duration-200"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white border border-sage rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-sage/20 text-dark text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-sage/50">
                <td className="p-3">
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/50"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    loading="lazy"
                  />
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.category?.name || "—"}</td>
                <td className="p-3">${product.price}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => handleEditClick(product)} className="text-fern hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}