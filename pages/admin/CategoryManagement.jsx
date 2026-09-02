import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import CategoryFormModal from "../admin/CategoryFormModal";
import Loader from "../../components/common/Loader";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c._id !== categoryId));
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark">Category Management</h1>
        <button
          onClick={handleAddClick}
          className="bg-fern text-white px-4 py-2 rounded-lg hover:bg-forest transition-colors duration-200"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white border border-sage rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead className="bg-sage/20 text-dark text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t border-sage/50">
                <td className="p-3">
                  <img
                    src={cat.image || "https://via.placeholder.com/50"}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded"
                    loading="lazy"
                  />
                </td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3 text-forest">{cat.slug}</td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => handleEditClick(cat)} className="text-fern hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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