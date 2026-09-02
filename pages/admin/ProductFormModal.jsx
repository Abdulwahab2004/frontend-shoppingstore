import { useState, useEffect } from "react";
import { getCategories } from "../../services/categoryService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function ProductFormModal({ product, onClose, onSave }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category?._id || "",
    images: product?.images?.[0] || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.images ? [formData.images] : [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-dark mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-dark">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-sage outline-none focus:border-fern"
            />
          </div>

          <Input label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
          <Input label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-dark">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border border-sage outline-none focus:border-fern"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <Input label="Image URL" name="images" value={formData.images} onChange={handleChange} />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-sage text-dark hover:bg-sage/20 transition-colors duration-200"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isSaving}>
              {product ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}