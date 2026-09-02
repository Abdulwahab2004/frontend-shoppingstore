import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const updateUserRole = async (userId, role) => {
  const res = await api.put(`/admin/users/${userId}/role`, { role });
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
};
export const getAllOrders = async () => {
  const res = await api.get("/admin/orders");
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/admin/orders/${orderId}/status`, { status });
  return res.data;
};