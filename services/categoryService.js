import api from "./api";

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const getCategoryById = async (id) => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};

export const createCategory = async (categoryData) => {
  const res = await api.post("/categories", categoryData);
  return res.data;
};

export const updateCategory = async (id, categoryData) => {
  const res = await api.put(`/categories/${id}`, categoryData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};