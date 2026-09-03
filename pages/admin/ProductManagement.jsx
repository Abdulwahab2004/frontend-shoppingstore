import { useEffect, useState, useCallback, useMemo } from "react";
import { Package, Plus, Pencil, Trash2, ImageOff, Search } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import ProductFormModal from "./ProductFormModal";
import Loader from "../../components/common/Loader";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
    );
  }, [products, search]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Package size={22} className="text-fern" />
          <h1 className="text-2xl font-bold text-dark">Product Management</h1>
          <span className="text-sm text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {products.length}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
            />
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 bg-fern text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest transition-all duration-200 hover:shadow-md whitespace-nowrap"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-dashed border-sage rounded-xl p-12 text-center">
          <Package size={32} className="mx-auto text-sage mb-2" />
          <p className="text-forest">No products yet. Add your first one to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-sage/60 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-sage/20 text-dark text-left">
              <tr>
                <th className="p-3 font-medium">Image</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-forest">
                    No products match your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-sage/40 hover:bg-sage/10 transition-colors duration-150"
                  >
                    <td className="p-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-sage/20 flex items-center justify-center text-sage">
                          <ImageOff size={18} />
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-dark font-medium">{product.name}</td>
                    <td className="p-3 text-forest">{product.category?.name || "—"}</td>
                    <td className="p-3 font-semibold text-dark">${product.price}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          product.stock === 0
                            ? "bg-red-100 text-red-700"
                            : product.stock <= 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-fern hover:bg-fern/10 transition-colors duration-200"
                          aria-label="Edit product"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                          aria-label="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

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