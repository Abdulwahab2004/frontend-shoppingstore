import { useEffect, useState, useCallback } from "react";
import { LayoutGrid, Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import CategoryFormModal from "./CategoryFormModal";
import Loader from "../../components/common/Loader";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddClick = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    if (editingCategory) {
      await updateCategory(editingCategory._id, formData);
    } else {
      await createCategory(formData);
    }
    setShowModal(false);
    fetchCategories();
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;
    setDeletingId(categoryId);
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c._id !== categoryId));
    } catch (err) {
      alert("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid size={22} className="text-fern" />
          <h1 className="text-2xl font-bold text-dark">Category Management</h1>
          <span className="text-sm text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {categories.length}
          </span>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 bg-fern text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest transition-all duration-200 hover:shadow-md"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white border border-dashed border-sage rounded-xl p-12 text-center">
          <LayoutGrid size={32} className="mx-auto text-sage mb-2" />
          <p className="text-forest">No categories yet. Add your first one to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-sage/60 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-sage/20 text-dark text-left">
              <tr>
                <th className="p-3 font-medium">Image</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Slug</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-t border-sage/40 hover:bg-sage/10 transition-colors duration-150"
                >
                  <td className="p-3">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-sage/20 flex items-center justify-center text-sage">
                        <ImageOff size={18} />
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-dark font-medium">{cat.name}</td>
                  <td className="p-3 text-forest font-mono text-xs">{cat.slug}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-fern hover:bg-fern/10 transition-colors duration-200"
                        aria-label="Edit category"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={deletingId === cat._id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                        aria-label="Delete category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}