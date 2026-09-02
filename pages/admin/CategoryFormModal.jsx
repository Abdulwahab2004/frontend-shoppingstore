import { useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function CategoryFormModal({ category, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    image: category?.image || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-dark mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit}>
          <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Image URL" name="image" value={formData.image} onChange={handleChange} />

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
              {category ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}