import { useState, useEffect } from "react";
import { X, PackagePlus, ImageOff } from "lucide-react";
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
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "images") setImageError(false);
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
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-fern/15 text-fern flex items-center justify-center">
              <PackagePlus size={18} />
            </div>
            <h2 className="text-lg font-bold text-dark">
              {product ? "Edit Product" : "Add Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-forest hover:bg-sage/20 hover:text-dark transition-colors duration-200"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

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
              className="w-full px-3 py-2 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
            <Input label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-dark">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <Input label="Image URL" name="images" value={formData.images} onChange={handleChange} />

          <div className="mb-4">
            <div className="w-full h-32 rounded-lg border border-dashed border-sage bg-sage/10 flex items-center justify-center overflow-hidden">
              {formData.images && !imageError ? (
                <img
                  src={formData.images}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-forest">
                  <ImageOff size={20} />
                  <span className="text-xs">Image preview</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

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