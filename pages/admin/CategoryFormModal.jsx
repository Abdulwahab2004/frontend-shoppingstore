import { useState } from "react";
import { X, FolderPlus, ImageOff } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function CategoryFormModal({ category, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    image: category?.image || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") setImageError(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
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
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-fern/15 text-fern flex items-center justify-center">
              <FolderPlus size={18} />
            </div>
            <h2 className="text-lg font-bold text-dark">
              {category ? "Edit Category" : "Add Category"}
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
          <Input label="Image URL" name="image" value={formData.image} onChange={handleChange} />

          <div className="mb-4">
            <div className="w-full h-32 rounded-lg border border-dashed border-sage bg-sage/10 flex items-center justify-center overflow-hidden">
              {formData.image && !imageError ? (
                <img
                  src={formData.image}
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
              {category ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}